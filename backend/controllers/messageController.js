const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const { pubClient } = require("../../chat/config/redisClient");
// const { redis } = require("../config/redis");
// const { io } = require("../../chat/socket");

async function getMessages(req, res) {}

async function addMessage(req, res) {
  try {
    const sender = req.user_id;
    const recipients = req.body.recipients;
    const content = req.body.message;
    const isGroup = false;

    const uniqueIds = [...new Set([...recipients, sender])];

    // Construct participant objects with addedAt timestamp
    const participantObjects = uniqueIds.map((id) => ({
      user: id,
      addedAt: new Date(),
    }));

    // Use only ObjectIds for matching (not full objects)
    const participantIds = uniqueIds;

    // Check if conversation already exists (compare by user IDs)
    let conversation = await Conversation.findOne(
      {
        isGroup: isGroup,
        "participants.user": { $all: participantIds },
        $expr: { $eq: [{ $size: "$participants" }, participantIds.length] },
      },
      {
        _id: 1,
        adminsApproveMembers: 1,
        editPermissionsMembers: 1,
        groupName: 1,
        groupIcon: 1,
        lastMessage: 1,
        unreadMessagesCount: 1,
        updatedAt: 1,
        createdAt: 1,
        isGroup: 1,
        participants: 1,
      }
    );

    let conversationId;

    if (!conversation) {
      console.log("No conversation found. Creating a new conversation!");

      const newConversation = new Conversation({
        participants: participantObjects,
        lastMessage: content,
        isGroup: isGroup,
        unreadMessagesCount: 1,
      });

      conversation = await newConversation.save();
      conversationId = conversation._id;

      const conversationObject = {
        conversationId,
        updatedAt: new Date(),
      };

      await User.bulkWrite(
        participantIds.map((participantId) => ({
          updateOne: {
            filter: {
              _id: participantId,
              "conversations.conversationId": { $ne: conversationId },
            },
            update: { $push: { conversations: conversationObject } },
          },
        }))
      );
    } else {
      console.log("Conversation found. Updating last message.");
      conversationId = conversation._id;

      // await Conversation.findByIdAndUpdate(conversationId, {
      //   $set: { lastMessage: content },
      //   $inc: { unreadMessagesCount: 1 },
      // });
      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: { lastMessage: content },
          $inc: { unreadMessagesCount: 1 },
        },
        { new: true } // ✅ this ensures the updated document is returned
      );

      await User.bulkWrite(
        // participantIds.map((participantId) => ({
        uniqueIds.map((id) => ({
          updateOne: {
            filter: {
              _id: id,
              "conversations.conversationId": conversationId,
            },
            update: { $set: { "conversations.$.updatedAt": new Date() } },
          },
        }))
      );
    }

    const currentMessage = new Message({
      conversationId,
      sender,
      content,
      recipients,
    });

    const savedMessage = await currentMessage.save();

    pubClient.publish(
      "chat_messages",
      JSON.stringify({
        conversation,
        message: savedMessage,
      })
    );

    console.log("conversation data");
    console.log(conversation);

    res.send("message_added_successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("error_occurred");
  }
}

async function addMessageToGroup(req, res) {
  try {
    const sender = req.user_id;

    const content = req.body.message;
    const conversationId = req.body.conversationId;

    console.log("Add message to group");

    // Using find and update because we need updated document
    const conversation = await Conversation.findByIdAndUpdate(
      { _id: conversationId },
      // { $set: { lastMessage: content } }
      { $set: { lastMessage: content }, $inc: { unreadMessagesCount: 1 } },
      { new: true } // ✅ this ensures the updated document is returned
    );

    // Update only the `updatedAt` field for existing conversations in user documents
    await User.bulkWrite(
      // participants.map((participantId) => ({
      conversation.participants.map((participant) => ({
        updateOne: {
          filter: {
            _id: participant.user,
            "conversations.conversationId": conversationId,
          },
          update: { $set: { "conversations.$.updatedAt": new Date() } },
        },
      }))
    );
    // }

    const recipients = conversation.participants.filter(
      (participant) => participant.user.toString() !== sender.toString()
    );

    // Save the new message
    const currentMessage = new Message({
      conversationId,
      sender,
      content,
      recipients: recipients,
    });

    const savedMessage = await currentMessage.save();
    console.log("Message saved successfully.");
    // console.log(savedMessage);
    // Notify recipients
    const data = {
      // conversationId,
      // sender,
      // lastUpdated: Date.now(),
      // content,
      // recipients: recipients,
      conversation: conversation,
      // message: currentMessage,
      message: savedMessage,
    };

    // Publish message to Redis
    pubClient.publish("chat_messages", JSON.stringify(data));

    res.send("message_added_successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("error_occurred");
  }
}

// TODO-
async function unsendMessages(req, res) {
  // Handle last message, pull messageId from messageIds in conversation collection, delete message document from message collection.
  // Check if it is pulling or not or if it needs to mongoose.types.schema.ObjectId

  try {
    // const {participants, message} = req.body;
    const sender = req.user_id;
    // const messageId = req.body.messageId;
    // const messageId = req.params.messageId;
    const messageIds = req.body.messageIds;
    // const conversationId = req.body.conversationId;
    const conversationId = req.body.conversationId;

    // const pull_MessageId_from_Conversation_Coll = await Conversation.updateOne(
    //   { _id: conversationId },
    //   {
    //     $pull: { messageIds: messageId },
    //   }
    // );
    // if (pull_MessageId_from_Conversation_Coll.modifiedCount > 0) {
    //   console.log("Pulled messageId from Conversation coll successfully.");
    // }

    // const unsend_Message = await Message.deleteOne({ _id: messageId });
    const deletedMessages = await Message.deleteMany({
      _id: { $in: messageIds },
    });

    // if (unsend_Message.modifiedCount > 0) {
    if (deletedMessages.deletedCount > 0) {
      console.log("Messages unsended successfully.");

      // Change last message text-
      const lastMessageText = await Message.findOne({
        conversationId: conversationId,
      }).sort({ createdAt: -1 });
      const changeLastMessageText = await Conversation.updateOne(
        { _id: conversationId },
        {
          $set: { lastMessage: lastMessageText },
        }
      );

      if (changeLastMessageText.modifiedCount > 0) {
        console.log("Last message text updated successfully.");
      }
    }

    // Send realtime updates to receiver-
    // Receiver sockets
    const socketIds = await redisClient.hKeys(`user:${receiver}`);
    console.log(`All active sockets for user ${receiver}:`, socketIds);
    if (socketIds.length === 0) {
      console.log(`❌ User ${receiver} is not online.`);
      return;
    }

    let update_data = {
      conversationId: conversationId,
      otherParticipant: sender,
      messageIds: messageIds,
    };

    // socketIds.forEach((socketId) => {
    //   io.to(socketId).emit("remove_message", update_data);
    // });

    // Publish message to Redis
    pubClient.publish("remove_chat_messages", JSON.stringify(update_data));

    res.send("message_unsended_successfully");
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// Mark messages as delivered using bulkWrite-
async function markMessagesAsDelivered(req, res) {
  try {
    let messageIds = req.body.messageIds; //get message ids [] here-
    const userId = req.user_id;

    if (!messageIds || messageIds.length === 0) {
      return res.send("no_messages_to_update");
    }

    // if (!messageIds.length) return; // Avoid empty bulkWrite calls

    const bulkOps = messageIds.map((messageId) => ({
      updateOne: {
        filter: {
          _id: messageId,
          "deliveredTo.user": { $ne: userId }, // Only update undelivered messages
        },
        update: {
          $push: { deliveredTo: { user: userId, deliveredAt: new Date() } },
        },
      },
    }));

    const result = await Message.bulkWrite(bulkOps);

    if (result.modifiedCount > 0) {
      console.log(
        `✅ Successfully marked ${result.modifiedCount} messages as delivered.`
      );
      res.send("message_delivered_marked_successfully");
    } else {
      console.log(
        "⚠️ No messages were updated (they might have already been delivered)."
      );
      res.send("message_delivered_marked_successfully");
    }
  } catch (error) {
    console.error("Error marking specific messages as delivered:", error);

    res.send("error_occurred");
  }
}

module.exports = {
  getMessages,
  addMessage,
  addMessageToGroup,
  unsendMessages,
  markMessagesAsDelivered,
}; // Exporting the functions
