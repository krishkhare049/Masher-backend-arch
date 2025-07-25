import database from "../../index.native";

async function fetchAllConversations() {
  try {
    const existingConversations = await database
      .get("conversations")
      .query()
      .fetch();
    // console.log("Fetched conversations:", existingConversations);

    for (let index = 0; index < existingConversations.length; index++) {
        const element = existingConversations[index]._raw;
        console.log("Fetched conversation:", element);
    }

  } catch (error) {
    console.log("Error while fetching all conversations: " + error);
  }
}

export default fetchAllConversations;
