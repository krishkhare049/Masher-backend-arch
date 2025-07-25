import { Q } from "@nozbe/watermelondb";
import database from "../../index.native";

// Helper to split an array into chunks
function chunkArray(array, chunkSize = 100) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Main wrapper
async function upsertBulkOtherUsersInChunks(
  data,
  chunkSize = 100
) {
  const chunks = chunkArray(data, chunkSize);

  console.log(
    `📦 Splitting ${data.length} other users into ${chunks.length} chunks`
  );

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`🚀 Processing chunk ${i + 1}/${chunks.length}...`);
    try {
      await upsertBulkOtherUsers(chunk);
      console.log(`✅ Chunk ${i + 1} processed successfully`);
    } catch (error) {
      console.error(`❌ Error in chunk ${i + 1}:`, error);
      // Optionally: retry, skip, or log somewhere
    }
  }

  console.log("🎉 All chunks processed.");
}

async function upsertBulkOtherUsers(data) {
  // console.log('bulkotheruserdata')
  // console.log(data)
  try {
    await database.write(async () => {
      const otherUsersCollection = database.get("otherusers");

      // 1. Get all existing userIds in one query for speed
      const incomingIds = data.map((otherUser) => otherUser._id);
      const existingOtherUsers = await otherUsersCollection
        // .query()
        .query(Q.where("user_id", Q.oneOf(incomingIds)))
        // .where("userId", Q.oneOf(incomingIds))
        .fetch();

      const existingMap = new Map();
      for (const otherUser of existingOtherUsers) {
        existingMap.set(otherUser._id, otherUser);
      }

      // 2. Prepare batch operations: update if exists, create otherwise
      const operations = data.map((otherUserData) => {
        const existing = existingMap.get(otherUserData._id);

        if (existing) {
          return existing.prepareUpdate((otherUser) => {
            // otherUser.userId = otherUserData.userId;
            otherUser.fullName = otherUserData.full_name;
            // otherUser.joined = otherUserData.joined;
            // otherUser.userEmail = otherUserData.user_email;
            otherUser.username = otherUserData.username;
            otherUser.userDescription = otherUserData.userDescription;
            otherUser.profileImgFilename = otherUserData.profile_image_filename.filename;
          });
        } else {
          return otherUsersCollection.prepareCreate((otherUser) => {
            otherUser.userId = otherUserData._id;
            otherUser.fullName = otherUserData.full_name;
            // otherUser.joined = otherUserData.joined;
            otherUser.joined = new Date(otherUserData.joined).getTime();
            // otherUser.userEmail = otherUserData.user_email;
            otherUser.username = otherUserData.username;
            otherUser.userDescription = otherUserData.userDescription;
            otherUser.profileImgFilename = otherUserData.profile_image_filename.filename;
          });
        }
      });

      // 3. Batch insert/update
      await database.batch(...operations);
      console.log("✅ Bulk other users inserted or updated.");
    });
  } catch (error) {
    console.log("Error while inserting other bulk users: " + error);
  }
}

// export default upsertBulkOtherUsers;

// await upsertBulkConversationsInChunks(allConversations, 100); // Or any chunk size like 50, 200 etc.

export default upsertBulkOtherUsersInChunks;