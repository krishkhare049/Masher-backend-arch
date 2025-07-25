import { Q } from "@nozbe/watermelondb";
import database, { conversationsCollection, messagesCollection } from "../../index.native";

// async function deleteBulkConversations(idsToDelete, permanently) {
async function deleteBulkConversations(idsToDelete) {
  try {
    console.log('idsToDelete')
    console.log(idsToDelete)
    await database.write(async () => {
      // Delete all conversations whose conversationId matches and mark them as deleted instead of destorying permanently method and later sync them with backend-
      // const conversations = await database
      //   .get("conversations")
      const conversations = await conversationsCollection
        .query(Q.where("conversation_id", Q.oneOf(idsToDelete)))
        .fetch();

      // Soft delete (for sync support)

    //   if (permanently === false) {
    //     const deletions = conversations.map((msg) => msg.markAsDeleted());
    //   } else if (permanently === true) {
        const conversationDeletions = conversations.map((conv) => conv.destroyPermanently());
    //   }

    // Also delete messages-
    const messages = await messagesCollection
        .query(Q.where("conversation_id", Q.oneOf(idsToDelete)))
        .fetch();

      // Soft delete (for sync support)

    //   if (permanently === false) {
    //     const deletions = conversations.map((msg) => msg.markAsDeleted());
    //   } else if (permanently === true) {
        const messageDeletions = messages.map((conv) => conv.destroyPermanently());

      //   Later develop a function to delete them using sync

      console.log('Deleted conversations and messages!')
      
    });
  } catch (error) {
    console.log("Error while deleting bulk conversations: " + error);
  }
}

export default deleteBulkConversations;
