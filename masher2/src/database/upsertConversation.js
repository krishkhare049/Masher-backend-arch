import { Q } from "@nozbe/watermelondb";
import database, { conversationsCollection } from "../../index.native";
import { format } from "date-fns";

async function upsertConversation(conversationData) {
  try {
    console.log("conversationData");
    // console.log('fsf' + conversationData.otherParticipants);

    // we are using particpants here-
    console.log('fsf' + conversationData);
    console.log(conversationData);
    // console.log(conversationData.participants);
    // console.log(conversationData._id);

    await database.write(async () => {
      // Step 1: Check if conversation exists
      const existingConversations = await database
        .get("conversations")
        // .query(Q.where("conversation_id", conversationData._id)) // Search by ID
        .query(Q.where("conversation_id", conversationData.conversationId)) // Search by ID
        // .query() // Search by ID
        .fetch();

      if (existingConversations.length > 0) {
        // Step 2: If conversation exists, update
        await existingConversations[0].update((conversation) => {
          // conversation.conversationId = conversationData.conversationId;
          // conversation.isGroup = conversationData.isGroup;
          conversation.groupName = conversationData.groupName;
          conversation.groupDescription = conversationData.groupDescription;
          conversation.isAdminsApproveMembers =
            conversationData.adminsApproveMembers;
          conversation.isEditPermissionsMembers =
            conversationData.editPermissionsMembers;
          conversation.groupIcon = conversationData.groupIcon.filename;
          // conversation.createdAt = conversationData.createdAt;
          // conversation.updatedAt = conversationData.updatedAt;
          conversation.updatedAt = new Date(
            conversationData.updatedAt
          ).getTime();
          conversation.formattedUpdatedDate = format(
            new Date(conversationData.updatedAt),
            "hh:mm a"
          );
          conversation.lastMessage = conversationData.lastMessage;
          // conversation.unreadMessagesCount = conversationData.unreadMessagesCount;
          conversation.unreadMessagesCount =
            conversationData.unreadMessagesCount;
        });
        console.log("✅ conversation updated:", conversationData.conversationId);

        if (conversationData.isGroup === false) {
          // Update other participants-
          // 🔍 Fetch existing participants from the database
          const existingParticipants = await database
            .get("conversation_other_participants")
            .query(Q.where("conversation_id", conversationData.conversationId)) // Search by conversation ID
            .fetch();

          // const updatedParticipantIds = conversationData.otherParticipants; // New participants list
          const updatedParticipantIds = conversationData.participants.map(
            (p) => p.user
          );
          // const updatedParticipantIds = conversationData.otherParticipants

          const existingParticipantIds = existingParticipants.map(
            (p) => p.userId
          );

          // ❌ Find participants to remove (not in updated list)
          const participantsToRemove = existingParticipants.filter(
            (p) => !updatedParticipantIds.includes(p.userId)
          );

          // ✅ Find new participants to add
          const newParticipants = updatedParticipantIds.filter(
            (userId) => !existingParticipantIds.includes(userId)
          );

          // ✅ If participants are unchanged, SKIP updates
          if (
            participantsToRemove.length === 0 &&
            newParticipants.length === 0
          ) {
            console.log("🔹 No participant changes, skipping update.");
            return;
          }

          // Prepare deletion of removed participants
          const deleteOperations = participantsToRemove.map((participant) =>
            participant.prepareDestroyPermanently()
          );

          // Prepare insertion of new participants
          // const insertOperations = newParticipants.map((userId) =>
          //   database
          //     .get("conversation_other_participants")
          //     .prepareCreate((participant) => {
          //       participant.userId = userId;
          //       participant.conversationId = conversationData._id; // ✅ Assign conversation ID correctly
          //       // participant.conversation.set(conversation);

          //       // DON'T use `.set(conversation)` in this case
          //       // However, if you're using .set(conversation), it automatically links using the Watermelon internal ID, so your current approach is correct but your query should use that internal ID.
          //       // participant.conversation.set(conversation); // ✅ Correct relation
          //       // participant.conversation.set(existingConversations[0]);
          //     })
          // );

          const insertOperations = newParticipants.map((userId) => {
            // const fullParticipant = conversationData.otherParticipants.find(p => p.user === userId);
            return database
              .get("conversation_other_participants")
              .prepareCreate((participant) => {
                participant.userId = userId;
                participant.conversationId = conversationData.conversationId; // ✅ Assign conversation ID correctly
                // participant.addedAt = new Date(fullParticipant.addedAt).getTime(); // if available
                // participant.isAdmin = admins.includes(userId);
              });
          });

          // 🏁 Batch update: apply only if changes are needed
          await database.batch(...deleteOperations, ...insertOperations);

          console.log("✅ Participants updated successfully!");
        }
      } else {
        // Step 3: If conversation doesn't exist, create new
        const conversation = await conversationsCollection.create(
          (conversation) => {
            // conversation._raw.id = userId; // Set a specific ID
            // conversation.conversationId = conversationData._id;
            conversation.conversationId = conversationData.conversationId;
            conversation.isGroup = conversationData.isGroup;
            conversation.groupName = conversationData.groupName;
            conversation.groupDescription = conversationData.groupDescription;
            conversation.isAdminsApproveMembers =
              conversationData.adminsApproveMembers;
            conversation.isEditPermissionsMembers =
              conversationData.editPermissionsMembers;
            conversation.groupIcon = conversationData.groupIcon.filename;
            // conversation.createdAt = conversationData.createdAt;
            conversation.createdAt = new Date(
              conversationData.createdAt
            ).getTime();
            // conversation.updatedAt = conversationData.updatedAt;
            conversation.updatedAt = new Date(
              conversationData.updatedAt
            ).getTime();
            conversation.formattedUpdatedDate = format(
              new Date(conversationData.updatedAt),
              "hh:mm a"
            );
            conversation.lastMessage = conversationData.lastMessage;
            conversation.unreadMessagesCount =
              conversationData.unreadMessagesCount;
          }
        );
        console.log("✅ New conversation created:", conversationData);

        if (conversationData.isGroup === false) {
          //   Add other participants to the conversation-
          //   await database
          //     .get("conversation_other_participants")
          //     .create((conversation) => {
          //       conversation.conversationId = conversationData.conversationId;
          //       conversation.userId = conversationData.userId; // Assuming userId is part of conversationData
          //     });

          // const otherParticipants = conversationData.otherParticipants; // List of participants
          const otherParticipants = conversationData.participants; // List of participants

          const participantRecords = otherParticipants.map((p) =>
            database
              .get("conversation_other_participants")
              .prepareCreate((participant) => {
                participant.userId = p.user; // ✅ Assign user ID correctly
                // participant.userId = p // ✅ Assign user ID correctly
                // participant.addedAt = new Date(p.addedAt).getTime(); // if available
                // participant.isAdmin = p.isAdmin; // if available
                participant.conversationId = conversationData.conversationId; // ✅ Assign conversation ID correctly

                // DON'T use `.set(conversation)` in this case
                // However, if you're using .set(conversation), it automatically links using the Watermelon internal ID, so your current approach is correct but your query should use that internal ID.
                // participant.conversation.set(conversation); // ✅ Correct relation
              })
          );

          await database.batch(...participantRecords); // Perform batch insert

          console.log("✅ Participants added successfully!");
        }
      }
    });
  } catch (error) {
    console.log("Error while inserting conversation: " + error);
  }
}

export default upsertConversation;

// In upsertConversation, i have to store other users data for participants
