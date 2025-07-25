import { Q } from "@nozbe/watermelondb";
import database, { messagesCollection } from "../../index.native";
import { format } from "date-fns";

// Helper to split an array into chunks
function chunkArray(array, chunkSize = 100) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Main wrapper
async function upsertBulkMessagesInChunks(data, chunkSize = 100) {
  const chunks = chunkArray(data, chunkSize);

  console.log(
    `📦 Splitting ${data.length} messages into ${chunks.length} chunks`
  );

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`🚀 Processing chunk ${i + 1}/${chunks.length}...`);
    try {
      await upsertBulkMessages(chunk);
      console.log(`✅ Chunk ${i + 1} processed successfully`);
    } catch (error) {
      console.error(`❌ Error in chunk ${i + 1}:`, error);
      // Optionally: retry, skip, or log somewhere
    }
  }

  console.log("🎉 All chunks processed.");
}

async function upsertBulkMessages(data) {
  try {
    await database.write(async () => {

      // console.log('data:kk')
      // console.log(data)

      // 1. Get all existing messageIds in one query for speed
      const incomingIds = data.map((msg) => msg._id);
      const existingMessages = await messagesCollection
        .query(Q.where("message_id", Q.oneOf(incomingIds)))
        // .where('messageId', Q.oneOf(incomingIds))
        .fetch();

        // console.log('existingMessages')
        // console.log('existingMessages' + existingMessages.length)
        // console.log(incomingIds)


      const existingMap = new Map();
      for (const msg of existingMessages) {
        existingMap.set(msg.messageId, msg);
      }

      // 2. Prepare batch operations: update if exists, create otherwise
      const operations = data.map((msgData) => {
        const existing = existingMap.get(msgData._id);
        // console.log('existing')
        // console.log(existing)
        // console.log(msgData._id)
        if (existing) {
          return existing.prepareUpdate((msg) => {
            // msg.sender = msgData.sender || "";
            msg.content = msgData.content || "";
            // msg.createdAt = msgData.createdAt || "";
            // msg.isSender = msgData.isSender;

            // message.sender = messageData.sender;
            msg.isEdited = msgData.isEdited;
          });
        } else {
          console.log('Adding new message!')
          return messagesCollection.prepareCreate((msg) => {
            msg.conversationId = msgData.conversationId;
            msg.messageId = msgData._id || "";
            msg.senderId = msgData.sender || "";
            msg.content = msgData.content || "";
            msg.createdAt = new Date(msgData.createdAt).getTime() || Date.now();
            msg.formattedDate = format(new Date(msgData.createdAt), "hh:mm a");
            msg.isSender = msgData.isSender;
            msg.isEdited = msgData.isEdited || false;
          });
        }
      });

      // 3. Batch insert/update
      await database.batch(...operations);
      console.log("✅ Bulk messages inserted or updated.");
    });
  } catch (error) {
    console.error("❌ Error in insertBulkMessages:", error);
  }
}

// export default upsertBulkMessages;

// await upsertBulkConversationsInChunks(allConversations, 100); // Or any chunk size like 50, 200 etc.

export default upsertBulkMessagesInChunks;
