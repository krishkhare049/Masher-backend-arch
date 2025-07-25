import { Q } from "@nozbe/watermelondb";
import database, { messagesCollection } from "../../index.native";

async function deleteBulkMessages(idsToDelete, permanently) {
  try {
    await database.write(async () => {
      // Delete all messages whose messageId matches and mark them as deleted instead of destorying permanently method and later sync them with backend-
      // const messages = await database
      //   .get("messages")
      const messages = await messagesCollection
        .query(Q.where("message_id", Q.oneOf(idsToDelete)))
        .fetch();

      // Soft delete (for sync support)

      if (permanently === false) {
        const deletions = messages.map((msg) => msg.markAsDeleted());
      } else if (permanently === true) {
        const deletions = messages.map((msg) => msg.destroyPermanently());
      }

      //   Later develop a function to delete them using sync

      console.log('Deleted messages!')
      
    });
  } catch (error) {
    console.log("Error while deleting bulk messages: " + error);
  }
}

export default deleteBulkMessages;
