// // import { pubClient, subClient } from "../config/redisClient.js";
// import { io } from "../socket.js";

// async function removeMessageToSocket(socketIds, data) {

//     // if(socketId && data){
//     //     io.to(socketId).emit("remove_message", data)
//     // }

//     socketIds.forEach((socketId) => {
//         io.to(socketId).emit("remove_message", data);
//       });
    
//     //   console.log(`Removed messages sent to user ${userId} on ${socketIds.length} sockets`);
      
// }

// export { removeMessageToSocket };

// CommonJS
// const { io } = require("../socket.js");
const { getIO } = require("../ioManager.js"); // Assuming you have a function to get the io instance


async function removeMessageToSocket(socketIds, data) {
  const io = getIO();
  if (!Array.isArray(socketIds) || socketIds.length === 0 || !data) {
    console.warn("removeMessageToSocket: Invalid socketIds or data.");
    return;
  }

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("remove_message", data);
  });

  // Optional: Uncomment for debugging
  // console.log(`Removed messages sent on ${socketIds.length} sockets.`);
}

module.exports = { removeMessageToSocket };