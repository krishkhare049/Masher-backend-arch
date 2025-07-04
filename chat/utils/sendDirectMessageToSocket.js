// // import { pubClient, subClient } from "../config/redisClient.js";
// import { io } from "../socket.js";

// // async function sendDirectMessageToSocket(socketIds, data) {

// //     // if(socketId && data){
// //     //     io.to(socketId).emit("new_message", data)
// //     // }
// //     console.log("Sending message to socketIds: ", socketIds);
// //     if (socketIds && socketIds.length > 0) {
// //     socketIds.forEach((socketId) => {
// //       io.to(socketId).emit("new_message", data);
// //     });
// //   }
  
// //     // console.log(`Message sent to user ${userId} on ${socketIds.length} sockets`);
// // }
// async function sendDirectMessageToSocket(eventName, socketIds, data) {

//     // if(socketId && data){
//     //     io.to(socketId).emit("new_message", data)
//     // }
//     console.log("Sending message to socketIds: ", socketIds);
//     if (socketIds && socketIds.length > 0) {
//     socketIds.forEach((socketId) => {
//       // io.to(socketId).emit("new_message", data);
//       io.to(socketId).emit(eventName, data);
//     });
//   }
  
//     // console.log(`Message sent to user ${userId} on ${socketIds.length} sockets`);
// }

// export { sendDirectMessageToSocket };

// CommonJS
// const { io } = require("../socket");
const { getIO } = require("../ioManager.js"); // Assuming you have a function to get the io instance


async function sendDirectMessageToSocket(eventName, socketIds, data) {
  const io = getIO();
  if (!eventName || !Array.isArray(socketIds) || socketIds.length === 0 || !data) {
    console.warn("sendDirectMessageToSocket: Invalid input.");
    return;
  }

  console.log("Sending message to socketIds:", socketIds);

  socketIds.forEach((socketId) => {
    io.to(socketId).emit(eventName, data);
  });

  // Optional debug log
  // console.log(`Message "${eventName}" sent to ${socketIds.length} sockets`);
}

module.exports = { sendDirectMessageToSocket };