// import { Q } from "@nozbe/watermelondb";
// import database from "../../index.native";
// import { format } from "date-fns";

// // Helper to split an array into chunks
// function chunkArray(array, chunkSize = 100) {
//   const chunks = [];
//   for (let i = 0; i < array.length; i += chunkSize) {
//     chunks.push(array.slice(i, i + chunkSize));
//   }
//   return chunks;
// }

// // Main wrapper
// async function upsertBulkConversationsInChunks(
//   conversationsData,
//   chunkSize = 100
// ) {
//   const chunks = chunkArray(conversationsData, chunkSize);

//   console.log(
//     `📦 Splitting ${conversationsData.length} conversations into ${chunks.length} chunks`
//   );

//   for (let i = 0; i < chunks.length; i++) {
//     const chunk = chunks[i];
//     console.log(`🚀 Processing chunk ${i + 1}/${chunks.length}...`);
//     try {
//       await upsertBulkConversations(chunk);
//       console.log(`✅ Chunk ${i + 1} processed successfully`);
//     } catch (error) {
//       console.error(`❌ Error in chunk ${i + 1}:`, error);
//       // Optionally: retry, skip, or log somewhere
//     }
//   }

//   console.log("🎉 All chunks processed.");
// }

// async function upsertBulkConversations(conversationsData) {
//   try {
//     await database.write(async () => {
//       const batchOperations = [];

//       for (const conversationData of conversationsData) {
//         // 🔍 Check if the conversation already exists
//         const existingConversations = await database
//           .get("conversations")
//           .query(Q.where("conversation_id", conversationData._id))
//           .fetch();

//         if (existingConversations.length > 0) {
//           const existingConversation = existingConversations[0];

//           console.log("Updating conversation");
//           // console.log(conversationData.lastMessage);
//           // Prepare update for conversation
//           const updateOp = existingConversation.prepareUpdate(
//             (conversation) => {
//               conversation.groupName = conversationData.groupName;
//               conversation.isAdminsApproveMembers =
//                 conversationData.adminsApproveMembers ?? null;
//               conversation.isEditPermissionsMembers =
//                 conversationData.editPermissionsMembers ?? null;
//               conversation.groupIcon = conversationData.groupIcon.filename;
//               // conversation.updatedAt = conversationData.updatedAt;
//               conversation.updatedAt = new Date(
//                 conversationData.updatedAt
//               ).getTime();
//               conversation.formattedUpdatedDate = format(
//                 new Date(conversationData.updatedAt),
//                 "hh:mm a"
//               );
//               conversation.lastMessage = conversationData.lastMessage;
//               conversation.unreadMessagesCount =
//                 conversationData.unreadMessagesCount;
//               // conversation.unreadMessagesCount +=
//               //   conversationData.unreadMessagesCount;
//             }
//           );
//           batchOperations.push(updateOp);

//           if (conversationData.isGroup === false) {
//             // Participants update
//             const existingParticipants = await database
//               .get("conversation_other_participants")
//               .query(Q.where("conversation_id", conversationData._id))
//               .fetch();

//             // const updatedParticipantIds = conversationData.otherParticipants;
//              const updatedParticipantIds = conversationData.otherParticipants.map(
//             (p) => p.user
//           );
//             const existingParticipantIds = existingParticipants.map(
//               (p) => p.userId
//             );

//             const participantsToRemove = existingParticipants.filter(
//               (p) => !updatedParticipantIds.includes(p.userId)
//             );

//             const newParticipants = updatedParticipantIds.filter(
//               (userId) => !existingParticipantIds.includes(userId)
//             );

//               // ✅ If participants are unchanged, SKIP updates
//           if (
//             participantsToRemove.length === 0 &&
//             newParticipants.length === 0
//           ) {
//             console.log("🔹 No participant changes, skipping update.");
//             return;
//           }

//             // Prepare deletions
//             const deleteOps = participantsToRemove.map((p) =>
//               p.prepareDestroyPermanently()
//             );
//             batchOperations.push(...deleteOps);

//             // Prepare insertions
//             const insertOps = newParticipants.map((userId) =>
//               database
//                 .get("conversation_other_participants")
//                 .prepareCreate((participant) => {
//                   participant.userId = userId;
//                   participant.conversationId = conversationData._id; // Make sure you're using the same ID consistently
//                 })
//             );
//             batchOperations.push(...insertOps);
//           }
//         } else {
//           // Create new conversation
//           const newConversation = await database
//             .get("conversations")
//             .prepareCreate((conversation) => {
//               conversation.conversationId = conversationData._id;
//               conversation.isGroup = conversationData.isGroup;
//               conversation.groupName = conversationData.groupName;
//               conversation.isAdminsApproveMembers =
//                 conversationData.adminsApproveMembers ?? null;
//               conversation.isEditPermissionsMembers =
//                 conversationData.editPermissionsMembers ?? null;
//               conversation.groupIcon = conversationData.groupIcon.filename;
//               // conversation.createdAt = conversationData.createdAt;
//               conversation.createdAt = new Date(
//                 conversationData.createdAt
//               ).getTime();
//               // conversation.updatedAt = conversationData.updatedAt;
//               conversation.updatedAt = new Date(
//                 conversationData.updatedAt
//               ).getTime();
//               conversation.formattedUpdatedDate = format(
//                 new Date(conversationData.updatedAt),
//                 "hh:mm a"
//               );

//               conversation.lastMessage = conversationData.lastMessage;
//               conversation.unreadMessagesCount =
//                 conversationData.unreadMessagesCount;
//               // conversation.unreadMessagesCount +=
//               //   conversationData.unreadMessagesCount;
//             });

//           batchOperations.push(newConversation);

//           if (conversationData.isGroup === false) {

//           const otherParticipants = conversationData.otherParticipants; // List of participants

//             // Add participants
//             const participantOps = otherParticipants.map(
//               (p) =>
//                 database
//                   .get("conversation_other_participants")
//                   .prepareCreate((participant) => {
//                     participant.userId = p.user;
//                     participant.conversationId = conversationData._id;
//                   })
//             );

//             batchOperations.push(...participantOps);
//           }
//         }
//       }

//       if (batchOperations.length > 0) {
//         await database.batch(...batchOperations);
//         console.log("✅ Bulk upsert complete!");
//       } else {
//         console.log("🔹 No changes detected. Skipping batch.");
//       }
//     });
//   } catch (error) {
//     console.log("❌ Error in upsertBulkConversations:", error);
//   }
// }

// // export default upsertBulkConversations;

// // await upsertBulkConversationsInChunks(allConversations, 100); // Or any chunk size like 50, 200 etc.

// export default upsertBulkConversationsInChunks;

import { Q } from "@nozbe/watermelondb";
import database from "../../index.native";
import { format } from "date-fns";

function chunkArray(array, chunkSize = 100) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function upsertBulkConversationsInChunks(conversationsData, chunkSize = 100) {
  const chunks = chunkArray(conversationsData, chunkSize);
  for (let i = 0; i < chunks.length; i++) {
    try {
      await upsertBulkConversations(chunks[i]);
    } catch (error) {
      console.error(`❌ Error in chunk ${i + 1}:`, error);
    }
  }
}

async function upsertBulkConversations(conversationsData) {
  try {

    // console.log('conversationsData')
    // console.log(conversationsData)

    await database.write(async () => {
      const batchOps = [];

      for (const convo of conversationsData) {
        const existing = await database
          .get("conversations")
          .query(Q.where("conversation_id", convo._id))
          .fetch();

        if (existing.length > 0) {
          const existingConvo = existing[0];

          // ❗ DO NOT return early if no change – just skip updates
          if (!existingConvo._hasPendingUpdate) {
            const updateOp = existingConvo.prepareUpdate((record) => {
              record.groupName = convo.groupName;
              record.groupDescription = convo.groupDescription ?? null;
              record.isAdminsApproveMembers = convo.adminsApproveMembers ?? null;
              record.isEditPermissionsMembers = convo.editPermissionsMembers ?? null;
              record.groupIcon = convo.groupIcon?.filename ?? null;
              record.updatedAt = new Date(convo.updatedAt).getTime();
              record.formattedUpdatedDate = format(new Date(convo.updatedAt), "hh:mm a");
              record.lastMessage = convo.lastMessage;
              record.unreadMessagesCount = convo.unreadMessagesCount;
            });
            batchOps.push(updateOp);
          }

          // ✅ Handle participants
          if (!convo.isGroup) {
            const existingParticipants = await database
              .get("conversation_other_participants")
              .query(Q.where("conversation_id", convo._id))
              .fetch();

            // const updatedIds = convo.otherParticipants.map((p) => p.user);
            const updatedIds = convo.otherParticipants
            const currentIds = existingParticipants.map((p) => p.userId);

            const toRemove = existingParticipants.filter(p => !updatedIds.includes(p.userId));
            const toAdd = updatedIds.filter(id => !currentIds.includes(id));

            if (toRemove.length > 0 || toAdd.length > 0) {
              batchOps.push(...toRemove.map(p => p.prepareDestroyPermanently()));
              batchOps.push(...toAdd.map(id =>
                database.get("conversation_other_participants").prepareCreate(p => {
                  p.userId = id;
                  p.conversationId = convo._id;
                })
              ));
            }
          }
        } else {
          const newConvo = await database.get("conversations").prepareCreate((c) => {
            c.conversationId = convo._id;
            c.isGroup = convo.isGroup;
            c.groupName = convo.groupName;
            c.groupDescription = convo.groupDescription ?? null;
            c.isAdminsApproveMembers = convo.adminsApproveMembers ?? null;
            c.isEditPermissionsMembers = convo.editPermissionsMembers ?? null;
            c.groupIcon = convo.groupIcon?.filename ?? null;
            c.createdAt = new Date(convo.createdAt).getTime();
            c.updatedAt = new Date(convo.updatedAt).getTime();
            c.formattedUpdatedDate = format(new Date(convo.updatedAt), "hh:mm a");
            c.lastMessage = convo.lastMessage;
            c.unreadMessagesCount = convo.unreadMessagesCount;
          });
          batchOps.push(newConvo);

          if (!convo.isGroup) {
            const participantOps = convo.otherParticipants.map(p =>
              database.get("conversation_other_participants").prepareCreate(part => {
                // part.userId = p.user;
                part.userId = p;
                part.conversationId = convo._id;
              })
            );
            batchOps.push(...participantOps);
          }
        }
      }

      // ✅ Very important: Only call batch() at the end, once
      if (batchOps.length > 0) {
        await database.batch(...batchOps);
        console.log("✅ Upsert complete.");
      }
    });
  } catch (error) {
    console.error("❌ Error in upsertBulkConversations:", error);
  }
}

export default upsertBulkConversationsInChunks;
