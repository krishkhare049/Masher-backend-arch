const { default: mongoose } = require("mongoose");
// const Conversation = require("../models/conversationModel"); // Importing the Conversation model
// const Message = require("../models/messageModel"); // Importing the Message model
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { pubClient } = require("../../chat/config/redisClient");
const moment = require("moment");

const fs = require("fs");
const access = require("fs").access;
const constants = require("fs").constants;

// Get all messages in a conversation
// async function getConversationAllMessages(req, res) {
//   const skip = parseInt(req.params.skip) || 0;
//   const limit = 50;

//   const userId = new mongoose.Types.ObjectId(req.user_id);

//   const conversationId = req.params.conversationId;

//   // console.log(conversationId);

//   const conversationMessages = await Message.find({
//     conversationId: conversationId, // Uses an index
//     "deliveredTo.user": { $ne: userId }, // Filter undelivered messages
//   })
//     .sort({ createdAt: -1 }) // Reverse order if needed
//     .skip(skip)
//     .limit(limit)
//     .lean() // Converts documents into plain JavaScript objects (better performance)
//     .then((messages) =>
//       messages.map((msg) => ({
//         ...msg,
//         isSender: msg.sender.toString() === userId.toString(), // Add isSender flag
//       }))
//     );
//   // Added isSender field here after limiting

//   console.log(conversationMessages);
//   if (conversationMessages) {
//     res.send(conversationMessages);
//   } else {
//     res.send("no_conversation_yet");
//   }
// }

// async function getConversationAllMessages(req, res) {
//   try {
//     const userId = new mongoose.Types.ObjectId(req.user_id);
//     const conversationId = req.params.conversationId;
//     const limit = 50;

//     // Optional timestamp cursor from query (for pagination)
//     const before = req.query.before ? new Date(req.query.before) : new Date();

//     // Fetch messages created before the cursor (or now if not passed)
//     const conversationMessages = await Message.find({
//       conversationId: new mongoose.Types.ObjectId(conversationId),
//       createdAt: { $lt: before }, // Cursor
//       "deliveredTo.user": { $ne: userId },
//     })
//       .sort({ createdAt: -1 }) // Newest first
//       .limit(limit)
//       .lean();

//     const formattedMessages = conversationMessages.map((msg) => ({
//       ...msg,
//       isSender: msg.sender.toString() === userId.toString(),
//     }));

//     res.send(formattedMessages);
//   } catch (error) {
//     console.error("Error fetching conversation messages:", error);
//     res.status(500).send("error_occurred");
//   }
// }
async function getConversationAllMessages(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user_id);
    const conversationId = new mongoose.Types.ObjectId(req.params.conversationId);
    const limit = 50;

    // Dual cursor: createdAt and _id
    const cursorDate = req.query.before ? new Date(req.query.before) : new Date();
    const cursorId = req.query.lastId ? new mongoose.Types.ObjectId(req.query.lastId) : null;

    // Cursor logic
    const matchCondition = {
      conversationId,
      "deliveredTo.user": { $ne: userId },
      $or: [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          ...(cursorId && { _id: { $lt: cursorId } }), // for tie-breaker on same timestamp
        },
      ],
    };

    const messages = await Message.find(matchCondition)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    const formattedMessages = messages.map((msg) => ({
      ...msg,
      isSender: msg.sender.toString() === userId.toString(),
    }));

    const nextCursor = formattedMessages.length > 0
      ? {
          before: formattedMessages[formattedMessages.length - 1].createdAt.toISOString(),
          lastId: formattedMessages[formattedMessages.length - 1]._id.toString(),
        }
      : null;

    res.json({
      messages: formattedMessages,
      nextCursor,
    });

  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).send("error_occurred");
  }
}


// FIX THIS-
// FIX THIS-

async function getConversationAllMessagesByParticipants(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user_id);
    const otherParticipantId = new mongoose.Types.ObjectId(req.params.otherParticipantId);
    const limit = 50;

    // Dual cursor
    const cursorDate = req.query.before ? new Date(req.query.before) : new Date();
    const cursorId = req.query.lastId ? new mongoose.Types.ObjectId(req.query.lastId) : null;

    const participants = [userId, otherParticipantId];

    const conversation = await Conversation.findOne(
      {
        participants: { $all: participants, $size: 2 },
        isGroup: false,
      },
      { _id: 1 }
    );

    if (!conversation) {
      return res.send("no_conversation_yet");
    }

    const conversationId = conversation._id;

    const matchCondition = {
      conversationId,
      "deliveredTo.user": { $ne: userId },
      $or: [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          ...(cursorId && { _id: { $lt: cursorId } }),
        },
      ],
    };

    const messages = await Message.find(matchCondition)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .select("-recipients")
      .lean();

    const formattedMessages = messages.map((msg) => ({
      ...msg,
      isSender: msg.sender.toString() === userId.toString(),
    }));

    const nextCursor =
      formattedMessages.length > 0
        ? {
            before: formattedMessages[formattedMessages.length - 1].createdAt.toISOString(),
            lastId: formattedMessages[formattedMessages.length - 1]._id.toString(),
          }
        : null;

    res.json({
      messages: formattedMessages,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching direct conversation messages:", error);
    res.status(500).send("error_occurred");
  }
}


async function createNewGroup(req, res) {
  try {
    const creator = req.user_id;
    const file = req.file ? req.file.filename : "default_group_icon";
    const groupName = req.body.groupName.trim();
    const groupDescription = req.body.groupDescription.trim();
    // const groupIcon = req.body.groupIcon;
    // const groupIcon = file.filename; // store path or URL;
    // console.log('file')
    // console.log(req.file)
    // console.log(file)

    const groupIcon = {
      filename: file,
      updated_at: moment().toDate().toISOString(),
    };

    // console.log(req.body.adminsApproveMembers)
    // console.log(req.body.editPermissionsMembers)

    const adminsApproveMembers = req.body.adminsApproveMembers === "true";
    const editPermissionsMembers = req.body.editPermissionsMembers === "true";
    const recipients = JSON.parse(req.body.recipients);

    // const participants = [...new Set([...recipients, creator])]; // Ensuring uniqueness

    // Ensure uniqueness, add creator
    const uniqueUserIds = [...new Set([...recipients, creator])];

    // Construct participant objects with addedAt
    const participants = uniqueUserIds.map((id) => ({
      user: id,
      addedAt: new Date(),
    }));

    // Create a new conversation
    // const newConversation = await Conversation.create({
    const newConversation = await Conversation({
      isGroup: true,
      adminsApproveMembers: adminsApproveMembers,
      editPermissionsMembers: editPermissionsMembers,
      groupName: groupName,
      groupDescription: groupDescription,
      groupIcon: groupIcon,
      participants: participants,
      admins: [creator],
    });

    await newConversation.save();

    // Add the new conversation to each participant's conversations array
    // Add conversation reference to users
    const conversationObject = {
      conversationId: newConversation._id,
      updatedAt: new Date(),
    };

    await User.bulkWrite(
      uniqueUserIds.map((participantId) => ({
        updateOne: {
          filter: {
            _id: participantId,
            "conversations.conversationId": {
              $ne: conversationObject.conversationId,
            },
          },
          update: { $push: { conversations: conversationObject } },
        },
      }))
    );

    // Does not check but faster-
    // await User.updateMany(
    //   { _id: { $in: participants } },
    //   { $push: { conversations: newConversation._id } }
    // );

    // Does not check because of nested object-
    // await User.updateMany(
    //   { _id: { $in: participants } },
    //   { $addToSet: { conversations: conversationObject} }
    // );

    const data = {
      conversation: newConversation,
      participants: participants,
      admins: [creator],
    };

    // Publish message to Redis
    pubClient.publish("new_group_created", JSON.stringify(data));

    res.send("group_created_successfully");
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// TODO-
// Delete a conversation
async function deleteConversations(req, res) {
  try {
    // Pull conversation from user conversations, don't delete it from conversation because we don't want to remove entire conversation from both participants.
    const sender = req.user_id;
    // const conversationId = req.params.conversationId;
    const conversationIds = req.body.conversationIds;

    console.log("Deleting conversations");
    // console.log(conversationIds);

    // const pull_Conversation_from_User_Conversations = await User.updateOne(
    //   { _id: sender },
    //   {
    //     $pull: {
    //       conversations: { conversationId: conversationId },
    //     },
    //   }
    // );

    // if (pull_Conversation_from_User_Conversations.modifiedCount > 0) {
    //   res.send("conversation_deleted_successfully");
    // }

    const pull_Conversation_from_User_Conversations = await User.updateOne(
      { _id: sender },
      // {
      //   $pullAll: {
      //     conversations: conversationIds,
      //   },
      // }
      {
        $pull: {
          conversations: {
            conversationId: { $in: conversationIds },
          },
        },
      }
    );

    if (pull_Conversation_from_User_Conversations.modifiedCount > 0) {
      res.send("conversation_deleted_successfully");
    }
  } catch (error) {
    console.log(error);
    res.send("error_occurred");
  }
}

// Get a conversation
async function getGroupConversationData(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user_id);

    const conversationId = req.params.conversationId;

    // console.log(conversationId);

    const conversationData = await Conversation.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(conversationId),
          isGroup: true,
        },
      },
      {
        $project: {
          _id: 1,
          participants: 1,
          // lastMessage: 1,
          adminsApproveMembers: 1,
          editPermissionsMembers: 1,
          groupName: 1,
          groupIcon: 1,
          admins: 1,
          updatedAt: 1,
          lastMessage: 1,
          unreadMessagesCount: 1,
          createdAt: 1,
          isAdmin: { $in: [userId, "$admins"] }, // Check if user is in the admins array
        },
      },
    ]);
    // console.log(conversationData);

    // Find participants in the conversation-
    // Note - Finding users by an array of user IDs in MongoDB is not a complex query as long as:
    // You use the _id field (which is indexed by default).

    // The number of user IDs isn’t excessively large (e.g., hundreds of thousands in a single query).

    // This is highly optimized in MongoDB because:

    // _id has a default B-tree index.

    // $in on an indexed field performs well for small-to-medium arrays (say, up to a few thousand values).

    // ⚠️ Performance Considerations:
    // If your arrayOfUserIds has 10,000+ items, performance may degrade.

    // For very large sets:

    // Consider batching the queries (e.g., chunks of 1000).

    // Use a read replica to offload heavy read traffic.

    // Make sure no other expensive query runs simultaneously.

    if (!conversationData || conversationData.length === 0) {
      return res.send("not_found");
    }

    // Extract user IDs from the nested participant objects
    const participantUserIds = conversationData[0].participants.map(
      (p) => p.user
    );

    const participantsData = await User.find(
      { _id: { $in: participantUserIds } },
      {
        _id: 1,
        username: 1,
        profile_image_filename: 1,
        full_name: 1,
        joined: 1,
      }
    ).lean();

    const data = {
      conversation: conversationData[0],
      participants: participantsData,
      myUserId: userId,
    };

    res.send(data);
  } catch (error) {
    console.error("Error in getGroupConversationData:", error);
    res.status(500).send("internal_error");
  }
}

async function addGroupIcon(req, res) {
  try {
    const file = req.file;
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;

    if (!conversationId || !file) {
      res
        .status(400)
        .json({ message: "conversationId and file are required." });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const conversation = await Conversation.findById(conversationId).select(
      "editPermissionsMembers admins participants groupIcon"
    );

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found." });
      return;
    }

    if (conversation.editPermissionsMembers) {
      // if (!conversation.participants.some((p) => p.equals(userObjectId))) {
      if (
        !conversation.participants.some(
          (p) => p.user.toString() === userObjectId.toString()
        )
      ) {
        res
          .status(403)
          .json({ message: "Must be a participant to add group icon." });
        return;
      }
    } else {
      // if (!conversation.admins.some((a) => a.equals(userObjectId))) {
      if (
        !conversation.admins.some(
          (a) => a.toString() === userObjectId.toString()
        )
      ) {
        res
          .status(403)
          .json({ message: "Admin rights required to add group icon." });
        return;
      }
    }

    const oldGroupIcon = conversation.groupIcon;

    if (
      oldGroupIcon?.filename &&
      oldGroupIcon.filename !== "default_group_icon"
    ) {
      const oldIconPath = `/MasherStorage/group_icons/${oldGroupIcon.filename}`;
      access(oldIconPath, constants.F_OK, (err) => {
        if (!err) {
          fs.rmSync(oldIconPath);
        } else {
          console.log("Old group icon does not exist.");
        }
      });
    }

    conversation.groupIcon = {
      filename: file.filename,
      updated_at: moment().toISOString(),
    };

    await conversation.save();

    res.status(200).json({ message: "uploaded" });
  } catch (error) {
    console.error("addGroupIcon error:", error);
    res.status(500).json({ message: "error_occurred" });
  }
}

async function removeGroupIcon(req, res) {
  try {
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;

    if (!conversationId) {
      res.status(400).json({ message: "conversationId is required." });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const conversation = await Conversation.findById(conversationId).select(
      "editPermissionsMembers admins participants groupIcon"
    );

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found." });
      return;
    }

    if (conversation.editPermissionsMembers) {
      // if (!conversation.participants.some((p) => p.equals(userObjectId))) {
      if (
        !conversation.participants.some(
          (p) => p.user.toString() === userObjectId.toString()
        )
      ) {
        res
          .status(403)
          .json({ message: "Must be a participant to remove group icon." });
        return;
      }
    } else {
      // if (!conversation.admins.some((a) => a.equals(userObjectId))) {
      if (
        !conversation.admins.some(
          (a) => a.toString() === userObjectId.toString()
        )
      ) {
        res
          .status(403)
          .json({ message: "Admin rights required to remove group icon." });
        return;
      }
    }

    const oldGroupIcon = conversation.groupIcon;

    if (
      oldGroupIcon?.filename &&
      oldGroupIcon.filename !== "default_group_icon"
    ) {
      const iconPath = `/MasherStorage/group_icons/${oldGroupIcon.filename}`;
      access(iconPath, constants.F_OK, (err) => {
        if (!err) {
          fs.rmSync(iconPath);
        } else {
          console.log("Group icon does not exist.");
        }
      });
    }

    conversation.groupIcon = {
      filename: "default_group_icon",
      updated_at: moment().toISOString(),
    };

    await conversation.save();

    res.status(200).json({ message: "deleted_group_icon_successfully" });
  } catch (error) {
    console.error("removeGroupIcon error:", error);
    res.status(500).json({ message: "error_occurred" });
  }
}

async function editGroupDetails(req, res) {
  try {
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;

    if (!conversationId) {
      res.json({ message: "conversationId is required." });
      return;
    }

    // Fields to update (including editPermissionsMembers)
    const { adminsApproveMembers, editPermissionsMembers, groupName } =
      req.body;

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    // Step 1: Fetch conversation doc to check current editPermissionsMembers & permission arrays
    const conversation = await Conversation.findById(conversationId).select(
      "editPermissionsMembers admins participants"
    );

    if (!conversation) {
      res.json({ message: "Conversation not found." });
      return;
    }

    // Step 2: Permission check based on current conversation.editPermissionsMembers
    if (conversation.editPermissionsMembers) {
      // Any participant can edit
      if (
        !conversation.participants.some(
          (p) => p.user.toString() === userObjectId.toString()
        )
      ) {
        res.json({ message: "Must be a participant to edit group details." });
        return;
      }
    } else {
      // Only admins can edit
      if (
        !conversation.admins.some(
          (a) => a.toString() === userObjectId.toString()
        )
      ) {
        res.json({ message: "Admin rights required to edit group details." });
        return;
      }
    }

    // Step 3: Prepare update fields, only add if provided
    const updateFields = {};
    if (adminsApproveMembers !== undefined)
      updateFields.adminsApproveMembers = adminsApproveMembers;
    if (editPermissionsMembers !== undefined)
      updateFields.editPermissionsMembers = editPermissionsMembers;
    if (groupName !== undefined) updateFields.groupName = groupName;

    if (Object.keys(updateFields).length === 0) {
      res.json({ message: "No valid fields provided to update." });
      return;
    }

    // Step 4: Update conversation document
    await Conversation.updateOne(
      { _id: conversationId },
      { $set: updateFields }
    );

    res.json({ message: "Group_details_updated_successfully" });
  } catch (error) {
    console.error("editGroupDetails error:", error);
    res.json({ message: "error_occurred" });
  }
}

async function exitGroup(req, res) {
  try {
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isAdmin = conversation.admins.includes(user_id);
    const adminCount = conversation.admins.length;

    // Filter out the user from participants
    conversation.participants = conversation.participants.filter(
      (p) => p.user.toString() !== user_id
    );

    // Remove from admins
    conversation.admins = conversation.admins.filter(
      (adminId) => adminId.toString() !== user_id
    );

    // If the exiting user was the ONLY admin and there are still participants
    if (isAdmin && adminCount === 1 && conversation.participants.length > 0) {
      // Find the second-oldest participant (by addedAt)
      const sortedParticipants = conversation.participants
        .slice()
        .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

      const newAdmin = sortedParticipants[0]?.user;
      if (newAdmin) {
        conversation.admins.push(newAdmin);
      }
    }

    await conversation.save();

    return res.json({ message: "group_exited_successfully" });
  } catch (error) {
    console.error("exitGroup error:", error);
    res.status(500).json({ message: "error_occurred" });
  }
}


async function removeParticipantFromGroup(req, res) {
  try {
    const user_id = req.user_id;
    const { participantId, conversationId } = req.body;

    if (!participantId || !conversationId) {
      return res.status(400).json({ message: "Participant ID and Conversation ID are required." });
    }

    // Step 1: Fetch the conversation and check if user_id is admin
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isRequestingUserAdmin = conversation.admins.includes(user_id);
    const isTargetUserAdmin = conversation.admins.includes(participantId);

    if (!isRequestingUserAdmin) {
      return res.status(403).json({ message: "Only admins can remove participants." });
    }

    if (isTargetUserAdmin) {
      return res.status(403).json({ message: "Cannot remove another admin." });
    }

    // Step 2: Remove the participant if they are not an admin
    conversation.participants = conversation.participants.filter(
      (p) => p.user.toString() !== participantId
    );

    await conversation.save();

    return res.json({ message: "Participant removed successfully." });
  } catch (error) {
    console.error("removeParticipantFromGroup error:", error);
    return res.status(500).json({ message: "error_occurred" });
  }
}
// async function addParticipantToGroup(req, res) {
//   try {
//     const user_id = req.user_id;
//     const { participantId, conversationId } = req.body;

//     if (!participantId || !conversationId) {
//       return res
//         .status(400)
//         .json({ message: "Participant ID and Conversation ID are required." });
//     }

//     const conversation = await Conversation.findById(conversationId);

//     if (!conversation) {
//       return res.status(404).json({ message: "Conversation not found." });
//     }

//     const isRequestingUserAdmin = conversation.admins.includes(user_id);
//     const adminsApprove = conversation.adminsApproveMembers;

//     // ✅ Check permission to add
//     if (adminsApprove && !isRequestingUserAdmin) {
//       return res.status(403).json({
//         message: "Only admins can add members to this group.",
//       });
//     }

//     // ✅ Check if user is already in participants
//     const alreadyParticipant = conversation.participants.some(
//       (p) => p.user.toString() === participantId
//     );

//     if (alreadyParticipant) {
//       return res.status(400).json({
//         message: "User is already a participant in the group.",
//       });
//     }

//     // ✅ Add the participant
//     conversation.participants.push({
//       user: participantId,
//       addedAt: new Date(),
//     });

//     await conversation.save();

//     return res.json({ message: "Participant added successfully." });
//   } catch (error) {
//     console.error("addParticipantToGroup error:", error);
//     return res.status(500).json({ message: "error_occurred" });
//   }
// }
async function addParticipantsToGroup(req, res) {
  try {
    const user_id = req.user_id;
    const { participantIds, conversationId } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length === 0 || !conversationId) {
      return res.status(400).json({
        message: "Participant IDs (as array) and Conversation ID are required.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isRequestingUserAdmin = conversation.admins.includes(user_id);
    const adminsApprove = conversation.adminsApproveMembers;

    // ✅ Check permission to add
    if (adminsApprove && !isRequestingUserAdmin) {
      return res.status(403).json({
        message: "Only admins can add members to this group.",
      });
    }

    let addedCount = 0;
    const now = new Date();

    // ✅ Add each participant if not already added
    participantIds.forEach((participantId) => {
      const alreadyParticipant = conversation.participants.some(
        (p) => p.user.toString() === participantId
      );

      if (!alreadyParticipant) {
        conversation.participants.push({
          user: participantId,
          addedAt: now,
        });
        addedCount++;
      }
    });

    await conversation.save();

    return res.json({
      message: `participants_added_successfully`});
  } catch (error) {
    console.error("addParticipantsToGroup error:", error);
    return res.status(500).json({ message: "error_occurred" });
  }
}

async function demoteMeFromAdmin(req, res) {
  try {
    const user_id = req.user_id;
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isAdmin = conversation.admins.includes(user_id);
    if (!isAdmin) {
      return res.status(403).json({ message: "You are not an admin." });
    }

    const participants = conversation.participants || [];

    // Check if the user is the only participant
    if (participants.length === 1 && participants[0].user.toString() === user_id) {
      return res.status(403).json({
        message: "You are the only participant in the group. Cannot demote.",
      });
    }

    const admins = conversation.admins.map((id) => id.toString());

    // If user is the only admin, promote another participant
    if (admins.length === 1 && admins[0] === user_id) {
      // Sort participants by addedAt
      const otherParticipants = participants
        .filter((p) => p.user.toString() !== user_id)
        .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

      if (otherParticipants.length === 0) {
        return res.status(403).json({
          message:
            "Cannot demote because there are no other participants to promote.",
        });
      }

      const newAdminId = otherParticipants[0].user;

      await Conversation.findByIdAndUpdate(conversationId, {
        $pull: { admins: user_id },
        $addToSet: { admins: newAdminId },
      });

      return res.json({
        message: "You were the only admin. Another participant has been promoted and you have been demoted.",
      });
    }

    // Normal demotion (not the only admin)
    await Conversation.findByIdAndUpdate(conversationId, {
      $pull: { admins: user_id },
    });

    return res.json({
      message: "You have been demoted from admin successfully.",
    });
  } catch (error) {
    console.error("demoteMeFromAdmin error:", error);
    return res.status(500).json({ message: "error_occurred" });
  }
}


module.exports = {
  getConversationAllMessages,
  getConversationAllMessagesByParticipants,
  createNewGroup,
  deleteConversations,
  getGroupConversationData,
  addGroupIcon,
  removeGroupIcon,
  editGroupDetails,
  exitGroup,
  removeParticipantFromGroup,
  addParticipantsToGroup,
  demoteMeFromAdmin
}; // Exporting the functions
