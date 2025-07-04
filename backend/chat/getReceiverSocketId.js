// import { pubClient, subClient } from "../config/redisClient.js";

// async function getReceiverSocketId(user_id) {
//   const sockets = await pubClient.hKeys(`user_sockets:${user_id}`);
//   console.log(`All socket IDs for user ${user_id}:`, sockets);

//   if (sockets.length === 0) {
//     console.log(`❌ User ${user_id} is not online.`);
//     return;
//   }

//   return sockets;
// }

// module.exports = { getReceiverSocketId };
