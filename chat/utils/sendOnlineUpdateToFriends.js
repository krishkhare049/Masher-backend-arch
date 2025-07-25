// import { getConversationFriends } from "../../backend/utils/getConversationFriends.js";
// import { io } from "../socket.js";
// import { getReceiverSocketId } from "./getReceiverSocketId.js";

// export default async function sendOnlineUpdateToFriends({ userId, status }) {
//   const participants = getConversationFriends(userId);

//   for (let i = 0; i < participants.length; i++) {
//     const participant = participants[i];

//     const participantSocketIds = getReceiverSocketId(participant._id);

//     for (let i = 0; i < participantSocketIds.length; i++) {
//       const socketId = participantSocketIds[i];
//       io.to(socketId).emit(
//         status === "online" ? "user_online" : "user_offline",
//         participant
//       );
//     }
//   }
// }


// CommonJS
const { getConversationFriends } = require("../../backend/utils/getConversationFriends");
// const { io } = require("../socket");
const { getIO } = require("../ioManager.js"); // Assuming you have a function to get the io instance
const { getReceiverSocketId } = require("./getReceiverSocketId");


async function sendOnlineUpdateToFriends({ userId, status }) {
  try {

    console.log('Sending update to friends')

    const io = getIO();
    
    const participants = await getConversationFriends(userId);

    console.log('Conversation friends: ', participants)
    if (!participants || participants.length === 0) return;

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      const participantSocketIds = await getReceiverSocketId(participant.otherParticipantId);
      if (!participantSocketIds || participantSocketIds.length === 0) continue;

      const eventName = status === "online" ? "user_online" : "user_offline";

      console.log('Event name: ', eventName)

      participantSocketIds.forEach((socketId) => {
        io.to(socketId).emit(eventName, participant);
      });
    }
  } catch (error) {
    console.error("Error sending online status update:", error);
  }
}

module.exports = sendOnlineUpdateToFriends;
