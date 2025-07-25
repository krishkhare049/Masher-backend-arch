import { format } from "date-fns";
import upsertBulkOtherUsersInChunks from "../database/upsertBulkOtherUsers";
import { axiosInstance } from "./axiosInstance";
import database from "../../index.native";
import { Q } from "@nozbe/watermelondb";

async function fetchConversationGroupData(conversationId) {

  console.log("Fetching group conversation data for ID:", conversationId);
  if (!conversationId) {
    return;
  }

  try {
    const response = await axiosInstance.get(
      "/api/conversations/getGroupConversationData/" + conversationId,
      {
        withCredentials: true,
      }
    );
    console.log("Fetching group conversation data for ID:", conversationId);
    console.log(response.data);

    const conversationResponse = response.data.conversation;

    // let convObj = {
    //   conversationId: conversationResponse._id,
    //   groupName: conversationResponse.groupName,
    //   createdAt: format(conversationResponse.createdAt, "dd-LLLL-yyyy"),
    //   groupIcon: conversationResponse.groupIcon.filename,
    //   // lastMessage: conversationResponse.lastMessage,
    //   // unreadMessagesCount: conversationResponse.unreadMessagesCount,
    //   isAdmin: conversationResponse.isAdmin,
    //   adminsApproveMembers: conversationResponse.adminsApproveMembers,
    //   editPermissionsMembers: conversationResponse.editPermissionsMembers,
    //   // lastSeen: response.data.lastSeen,
    //   // isOnline: response.data.online,
    // };

    //   setConversationData(convObj);
    //   setParticipantsData(response.data.participants);
    // dispatch(setGroupParticipantsData(response.data.participants));
    // dispatch(setGroupConversationData(convObj));

    // Upsert participants data-
    upsertBulkOtherUsersInChunks(response.data.participants, 100);

    // Upsert conversation and add participants in conversation other participants -
    // upsertConversation(convObj);

    // Add participants in conversation other participants-
    const participantsIncludingMe = response.data.conversation.participants;
    const admins = response.data.conversation.admins;
    console.log("ParticipantsIncludingMe:", participantsIncludingMe);

    // // Excluding me-
    // const otherParticipants = participants.filter(
    //   (participant) => participant !== response.data.myUserId
    // );

    // ///////////////////////////
    // Upsert participants in conversation other participants-
    console.log("Conversation ID:", conversationResponse.adminsApproveMembers);
    console.log(conversationResponse);
    if (!conversationResponse._id) {
      console.error("❌ conversationResponse._id is undefined!");
      return;
    }
    await database.write(async () => {
      // Upsert conversation data-
      const existingConversations = await database
        .get("conversations")
        .query(Q.where("conversation_id", conversationResponse._id)) // Search by ID
        // .query() // Search by ID
        .fetch();

      console.log("Existing Conversations:", existingConversations);

      if (existingConversations.length > 0) {
        // Step 2: If conversation exists, update
        await existingConversations[0].update((conversation) => {
          // conversation.conversationId = conversationResponse.conversationId;
          // conversation.isGroup = conversationResponse.isGroup;
          conversation.groupName = conversationResponse.groupName;
          conversation.groupDescription = conversationResponse.groupDescription;
          conversation.isAdminsApproveMembers =
            conversationResponse.adminsApproveMembers;
          conversation.isEditPermissionsMembers =
            conversationResponse.editPermissionsMembers;
          conversation.groupIcon = conversationResponse.groupIcon.filename;
          // conversation.createdAt = conversationResponse.createdAt;
          // conversation.updatedAt = conversationResponse.updatedAt;
          conversation.updatedAt = new Date(
            conversationResponse.updatedAt
          ).getTime();
          conversation.formattedUpdatedDate = format(
            new Date(conversationResponse.updatedAt),
            "hh:mm a"
          );
          conversation.lastMessage = conversationResponse.lastMessage;
          // conversation.unreadMessagesCount = conversationResponse.unreadMessagesCount;
          conversation.unreadMessagesCount =
            conversationResponse.unreadMessagesCount;
        });
        console.log("✅ conversation updated:", conversationResponse._id);
      } else {
        const conversation = await conversationsCollection.create(
          (conversation) => {
            // conversation._raw.id = userId; // Set a specific ID
            conversation.conversationId = conversationResponse._id;
            conversation.isGroup = conversationResponse.isGroup;
            conversation.groupName = conversationResponse.groupName;
            conversation.groupDescription =
              conversationResponse.groupDescription;
            conversation.isAdminsApproveMembers =
              conversationResponse.adminsApproveMembers;
            conversation.isEditPermissionsMembers =
              conversationResponse.editPermissionsMembers;
            conversation.groupIcon = conversationResponse.groupIcon.filename;
            // conversation.createdAt = conversationResponse.createdAt;
            conversation.createdAt = new Date(
              conversationResponse.createdAt
            ).getTime();
            // conversation.updatedAt = conversationResponse.updatedAt;
            conversation.updatedAt = new Date(
              conversationResponse.updatedAt
            ).getTime();
            conversation.formattedUpdatedDate = format(
              new Date(conversationResponse.updatedAt),
              "hh:mm a"
            );
            conversation.lastMessage = conversationResponse.lastMessage;
            conversation.unreadMessagesCount =
              conversationResponse.unreadMessagesCount;
          }
        );
        console.log("✅ New conversation created:", conversationResponse);
      }

      // 🔍 Fetch existing participants from the database
      const existingParticipants = await database
        .get("conversation_other_participants")
        .query(Q.where("conversation_id", conversationResponse._id))
        .fetch();

      console.log("Existing Participants:", existingParticipants);

      // const updatedParticipantIds = participantsIncludingMe;
      const updatedParticipantIds = participantsIncludingMe.map((p) => p.user); // Extract user IDs
      const existingParticipantIds = existingParticipants.map((p) => p.userId);
      console.log("Updated Participant IDs:", updatedParticipantIds);
      console.log("Existing Participant IDs:", existingParticipantIds);

      // ❌ Find participants to remove (not in updated list)
      const participantsToRemove = existingParticipants.filter(
        (p) => !updatedParticipantIds.includes(p.userId)
      );

      // ✅ Find new participants to add
      const newParticipants = updatedParticipantIds.filter(
        (userId) => !existingParticipantIds.includes(userId)
      );
      console.log("newParticipants:", newParticipants);
      // ✅ If participants are unchanged, SKIP updates
      if (participantsToRemove.length === 0 && newParticipants.length === 0) {
        console.log("🔹 No participant changes, skipping update.");
        return;
      }

      // Prepare deletion of removed participants
      const deleteOperations = participantsToRemove.map((participant) =>
        participant.prepareDestroyPermanently()
      );

      console.log("Adding new participant:");
      // Prepare insertion of new participants
      // const insertOperations = newParticipants.map((p) =>

      //   database
      //     .get("conversation_other_participants")
      //     .prepareCreate((participant) => {

      //        const fullParticipantData = participantsIncludingMe.find(p => p.user === userId);
      // participant.userId = userId;
      // participant.conversationId = conversationResponse._id;
      // participant.addedAt = new Date(fullParticipantData?.addedAt || new Date()).getTime();
      // participant.isAdmin = admins.includes(userId);

      //       // participant.userId = p.user;
      //       // participant.conversationId = conversationResponse._id;
      //       // participant.addedAt = new Date(p.addedAt).getTime() || new Date().getTime();
      //       // participant.isAdmin = admins.includes(p.user); // ✅ Mark as admin if applicable
      //     })
      // );
      const insertOperations = newParticipants.map((userId) =>
        database
          .get("conversation_other_participants")
          .prepareCreate((participant) => {
            participant.userId = userId; // ✅ This is just a string
            participant.conversationId = conversationResponse._id;
            participant.addedAt = Date.now(); // You won’t have addedAt info in this case
            participant.isAdmin = admins.includes(userId);
          })
      );

      // ✅ Optional: Update isAdmin for existing participants (if needed)
      const updateOperations = existingParticipants
        .filter((p) => {
          const shouldBeAdmin = admins.includes(p.userId);
          return p.isAdmin !== shouldBeAdmin;
        })
        .map((participant) =>
          participant.update((p) => {
            p.isAdmin = admins.includes(p.userId);
          })
        );

      // 🏁 Batch all operations
      await database.batch(
        ...deleteOperations,
        ...insertOperations,
        ...updateOperations
      );

      console.log("✅ Participants updated successfully!");
    });
    // ///////////////////////////
  } catch (error) {
    console.log(error);
  }
}

export default fetchConversationGroupData;
