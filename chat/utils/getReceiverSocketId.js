// import { pubClient, subClient } from "../config/redisClient.js";

// async function getReceiverSocketId(user_id) {
//   const sockets = await pubClient.hkeys(`user_sockets:${user_id}`);
//   console.log(`All socket IDs for user ${user_id}:`, sockets);

//   if (sockets.length === 0) {
//     console.log(`❌ User ${user_id} is not online.`);
//     return;
//   }

//   return sockets;
// }

// export { getReceiverSocketId };

// Common js-
const { pubClient } = require("../config/redisClient");

async function getReceiverSocketId(user_id) {
  try {
    const sockets = await pubClient.hkeys(`user_sockets:${user_id}`);
    console.log(`All socket IDs for user ${user_id}:`, sockets);

    if (!sockets || sockets.length === 0) {
      console.log(`❌ User ${user_id} is not online.`);
      return null;
    }

    return sockets;
  } catch (error) {
    console.error(`❌ Error fetching socket IDs for user ${user_id}:`, error);
    return null;
  }
}

module.exports = { getReceiverSocketId };
