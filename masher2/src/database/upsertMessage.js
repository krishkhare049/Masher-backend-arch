import { Q } from "@nozbe/watermelondb";
import database from "../../index.native";
import { format } from "date-fns";

async function upsertMessage(messageData) {
  try {

    // console.log("messageDatakk" + messageData.messageId);
    // console.log(messageData);

    if (!messageData.messageId) {
      console.warn("❌ messageId is undefined or null, skipping upsert.");
      return;
    }

    await database.write(async () => {
      // Step 1: Check if message exists
      const existingMessages = await database
        .get("messages")
        // .query(Q.where("message_id", messageData._id)) // Search by ID
        .query(Q.where("message_id", messageData.messageId)) // Search by ID
        // .query() // Search by ID
        .fetch();

        // console.log('existingMessages' + existingMessages.length)

      if (existingMessages.length > 0) {
        // Step 2: If message exists, update
        await existingMessages[0].update((message) => {
          // message.conversationId = messageData.conversationId;
          // message.messageId = messageData.messageId;
          // message.sender = messageData.sender;
          message.content = messageData.content;
          // message.createdAt = messageData.createdAt;
          // message.isSender = messageData.isSender;
          message.isEdited = messageData.isEdited;
        });
        // console.log("✅ Message updated:", messageData._id);
        console.log("✅ Message updated:", messageData.messageId);
      } else {
        // Step 3: If message doesn't exist, create new
        await database.get("messages").create((message) => {
          // message._raw.id = userId; // Set a specific ID
          message.conversationId = messageData.conversationId;
          // message.messageId = messageData._id;
          message.messageId = messageData.messageId;
          message.senderId = messageData.sender;
          message.content = messageData.content;
          message.createdAt = new Date(messageData.createdAt).getTime() || Date.now();
          message.formattedDate = format(new Date(messageData.createdAt), "hh:mm a");
          message.isSender = messageData.isSender;
          message.isEdited = messageData.isEdited;
        });
        console.log("✅ New message created:", messageData);
      }
    });
  } catch (error) {
    console.error("Error in upsertMessage:", error);
  }
}

export default upsertMessage;
