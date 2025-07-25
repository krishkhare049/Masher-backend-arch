// const { pubClient } = require("../config/redisClient");

// // Get socket IDs of multiple recipient user IDs (for group messages)
// async function getReceiverSocketIdList(recipients) {
//   try {
//     const allSockets = [];

//     console.log("Fetching socket IDs for recipients:", recipients);

//     for (const userId of recipients) {
//       const sockets = await pubClient.hkeys(`user_sockets:${userId}`);
      
//       console.log(`Found sockets for user ${userId}:`, sockets);
//       if (sockets && sockets.length > 0) {
//         allSockets.push(...sockets);
//       }
//     }

//     // Remove duplicates if any
//     return [...new Set(allSockets)];
//   } catch (error) {
//     console.error("❌ Error fetching socket IDs for recipients:", error);
//     return [];
//   }
// }

// module.exports = { getReceiverSocketIdList };

const { pubClient } = require("../config/redisClient");

// Get socket IDs of multiple recipient user IDs (for group messages)
async function getReceiverSocketIdList(recipients) {
  try {
    const allSockets = [];
    const notFoundUsers = [];

    console.log("Fetching socket IDs for recipients:", recipients);

    for (const userId of recipients) {
      const sockets = await pubClient.hkeys(`user_sockets:${userId}`);

      console.log(`Found sockets for user ${userId}:`, sockets);

      if (sockets && sockets.length > 0) {
        allSockets.push(...sockets);
      } else {
        notFoundUsers.push(userId);
      }
    }

    // Remove duplicate socket IDs
    const uniqueSockets = [...new Set(allSockets)];

    return {
      foundSocketIds: uniqueSockets,
      notFoundUserIds: notFoundUsers,
    };
  } catch (error) {
    console.error("❌ Error fetching socket IDs for recipients:", error);
    return {
      foundSocketIds: [],
      notFoundUserIds: recipients, // assume all failed
    };
  }
}

module.exports = { getReceiverSocketIdList };
