// // socket.js

// import { Server } from "socket.io";
// import { verifyToken } from "../backend/authentication/jwt_token.js";
// import { createAdapter, createShardedAdapter } from "@socket.io/redis-adapter";
// import { pubClient, subClient } from "./config/redisClient.js";
// import http from "http";
// import { sendDirectMessageToSocket } from "./utils/sendDirectMessageToSocket.js";
// import { getReceiverSocketId } from "./utils/getReceiverSocketId.js";
// import sendOnlineUpdateToFriends from "./utils/sendOnlineUpdateToFriends.js";
// const server = http.createServer();

// // const io = new Server(3000, {
// const io = new Server(server, {
//   adapter: createShardedAdapter(pubClient, subClient),
//   // adapter: createAdapter(pubClient, subClient),
//   cors: {
//     origin: "*", // Adjust this according to your needs
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Subscribe to Redis channel only once

// let isSubscribed = false;

// if (!isSubscribed) {
//   // subClient.subscribe("chat_messages", (err, count) => {
//   //   if (err) {
//   //     console.error("❌ Failed to subscribe: ", err);
//   //   } else {
//   //     isSubscribed = true;
//   //     console.log(`✅ Subscribed to ${count} channel(s).`);
//   //   }
//   // });
//   subClient.subscribe("chat_messages", (err) => {
//     if (err) console.error("❌ Failed to subscribe to chat_messages");
//     else console.log("✅ Subscribed to chat_messages");
//   });

//   subClient.subscribe("group_events", (err) => {
//     if (err) console.error("❌ Failed to subscribe to group_events");
//     else console.log("✅ Subscribed to group_events");
//   });

//   isSubscribed = true;
// }

// // Listen for messages from Redis and broadcast to WebSocket clients
// subClient.on("message", async (channel, message) => {
//   if (channel === "chat_messages") {
//     console.log(`📢 Broadcasting message:`, message);

//     // Redis Pub/Sub messages are sent as strings- Parse the JSON message
//     // console.log(JSON.parse(message).receiver);
//     let messageData = JSON.parse(message);

//     console.log("Message Data: ", messageData);

//     // Find sockets of the receiver-
//     const sockets = await getReceiverSocketId(
//       messageData.message.recipients[0]
//     );
//     const my_sockets = await getReceiverSocketId(messageData.message.sender);
//     console.log("Sockets of the receiver: ", sockets);
//     // sendDirectMessageToSocket(sockets, JSON.parse(message));
//     // sendDirectMessageToSocket(sockets, messageData);
//     sendDirectMessageToSocket("new_message", sockets, messageData);
//     sendDirectMessageToSocket("my_new_message", my_sockets, messageData);

//     // io.emit("new_message", JSON.parse(message)); // Emit to all connected clients
//     // io.to(message.receiver).emit("new_message", JSON.parse(message)); // Emit to all connected clients
//   } else if (channel === "group_events") {
//     const event = JSON.parse(message);

//     if (event.type === "group_created") {
//       const sockets = await getReceiverSocketIdList(event.data.members);
//       sendDirectMessageToSocket("group_created", sockets, event.data);
//     }

//     // In future, you can add:
//     // if (event.type === "group_renamed") { ... }
//     // if (event.type === "group_deleted") { ... }
//   }
// });

// io.use(async (socket, next) => {
//   // ...

//   console.log("Middleware socket Id: " + socket.id);

//   // const auth = socket.handshake.auth;

//   // console.log(auth.token)

//   // if (auth && auth.token) {
//   // const token = socket.handshake.auth.token._j;
//   // const token = auth.token._j;
//   // console.log("🔹 Raw Token Received (Type:", typeof token, "):", token);
//   // console.log(token);

//   // const authHeader = socket.handshake.headers.authorization;
//   const authHeader = socket.handshake.auth?.token;
//   // console.log("🔹 Auth Header:", authHeader)

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.log("❌ Authentication error");
//     return next(new Error("Authentication error"));
//   }

//   // const token = authHeader.split(" ")[1];
//   const token = authHeader.split("Bearer ")[1];
//   // console.log("🔹 Token Received:", token);
//   // console.log("🔹 Token Type:", typeof token);

//   // console.log("🔹 Token (JSON):", JSON.stringify(token, null, 2));

//   if (typeof token !== "string") {
//     console.log("🔹 Token is an object, converting to string...");
//     token = JSON.stringify(token); // Convert object to string
//   }

//   const token_data = await verifyToken(token);
//   console.log(token_data);

//   if (token_data == "err_while_verifying_jwt") {
//     //   req.user_id = "no_id";
//     console.log("Error while verifying jwt");
//     return next(new Error("Invalid token"));
//   } else {
//     //  Adding custom data to the socket object
//     const user_id = token_data._id;
//     socket.handshake.userId = user_id;

//     next();
//   }
//   // } else {
//   //   return next(new Error("Token missing"));
//   // }

//   // next();
// });

// io.on("connection", async (socket) => {
//   console.log("A user connected");

//   const userId = socket.handshake.userId;

//   if (userId) {
//     // Remove stale sockets
//     const existingSockets = await pubClient.hgetall(`user_sockets:${userId}`);

//     let reconnected = false;

//     for (const socketId in existingSockets) {
//       // const socketData = JSON.parse(existingSockets[socketId]);

//       let socketData;
//       try {
//         socketData = JSON.parse(existingSockets[socketId]);
//       } catch (err) {
//         console.error(
//           `Error parsing socket data for ${socketId} for user ${userId}:`,
//           err
//         );
//         await pubClient.hdel(`user_sockets:${userId}`, socketId);
//         continue;
//       }

//       // If there's an inactive socket within 5 minutes, mark it as reconnected
//       if (
//         socketData.status === "disconnected" &&
//         Date.now() - socketData.timestamp <= 300000
//       ) {
//         await pubClient.hset(
//           `user_sockets:${userId}`,
//           socketId,
//           JSON.stringify({ status: "connected", timestamp: Date.now() })
//         );

//         console.log(
//           `User ${userId} reconnected using existing socket ${socketId}`
//         );
//         reconnected = true;
//       }

//       // If socket is marked as disconnected for more than 5 minutes, remove it
//       // if (
//       //   socketData.status === "disconnected" &&
//       //   Date.now() - socketData.timestamp > 300000
//       // ) {
//       else {
//         await pubClient.hdel(`user_sockets:${userId}`, socketId);
//         console.log(`Removed stale socket: ${socketId} for user: ${userId}`);
//       }
//     }

//     // Send online user request to friends-
//     sendOnlineUpdateToFriends({ userId: userId, status: "online" });

//     // if (!reconnected) {
//     //   // Store the new active socket connection
//     //   await pubClient.hset(
//     //     `user_sockets:${userId}`,
//     //     socket.id,
//     //     JSON.stringify({ status: "connected", timestamp: Date.now() })
//     //   );
//     //   await pubClient.expire(`user_sockets:${userId}`, 86400); // Expire after 24 hours

//     //   console.log(`User ${userId} connected with socket ID ${socket.id}`);
//     // }

//     const multi = pubClient.multi();
//     if (!reconnected) {
//       multi.hset(
//         `user_sockets:${userId}`,
//         socket.id,
//         JSON.stringify({ status: "connected", timestamp: Date.now() })
//       );
//       multi.expire(`user_sockets:${userId}`, 86400);
//     }
//     await multi.exec();
//     console.log(`User ${userId} connected with socket ID ${socket.id}`);
//   }

//   // socket.emit("welcome", { id: socket.id });

//   socket.on("userTyping", async (data) => {
//     console.log("User typing", data);
//     console.log("User typing", userId);
//     let newData = {
//       username: data.username,
//       // sendToOtherUser: data.sendToOtherUser,
//     };
//     // io.to(data.sendToOtherUser).emit('displayTyping', newData);

//     console.log("Typing socket id: " + socket.id);
//     const sockets = await getReceiverSocketId(data.sendToOtherUser);
//     console.log("Sockets of the receiver: ", sockets);
//     // sendDirectMessageToSocket(sockets, JSON.parse(message));
//     sendDirectMessageToSocket("displayTyping", sockets, newData);
//   });

//   socket.on("userStoppedTyping", async (data) => {
//     console.log("User stopped typing", data);
//     let newData = {
//       userId: userId,
//       sendToOtherUser: data.sendToOtherUser,
//     };
//     // io.to(data.sendToOtherUser).emit('hideTyping', newData);

//     console.log("Stopped Typing socket id: " + socket.id);
//     const sockets = await getReceiverSocketId(data.sendToOtherUser);
//     console.log("Sockets of the receiver: ", sockets);

//     sendDirectMessageToSocket("hideTyping", sockets, newData);
//   });

//   // setTimeout(() => {
//   //   console.log("Sending message to user" + userId + socket.id);
//   //   // socket.emit('welcome', {data: 'hello'})
//   //   io.to(socket.id).emit("welcome", { data: "hello" });
//   // }, 1000);

//   socket.on("disconnect", async () => {
//     if (userId) {
//       // Mark socket as disconnected instead of deleting it immediately
//       await pubClient.hset(
//         `user_sockets:${userId}`,
//         socket.id,
//         JSON.stringify({ status: "disconnected", timestamp: Date.now() })
//       );

//       // Send online user request to friends-
//       sendOnlineUpdateToFriends({ userId: userId, status: "offline" });

//       setTimeout(async () => {
//         const socketData = await pubClient.hget(
//           `user_sockets:${userId}`,
//           socket.id
//         );
//         if (socketData) {
//           const parsedData = JSON.parse(socketData);
//           if (
//             parsedData.status === "disconnected" &&
//             Date.now() - parsedData.timestamp > 300000
//           ) {
//             await pubClient.hdel(`user_sockets:${userId}`, socket.id);
//             console.log(
//               `Socket ${socket.id} removed due to prolonged disconnection.`
//             );
//           }
//         }
//       }, 300000); // 5 minutes

//       console.log(
//         `User ${userId} temporarily disconnected. Socket ID ${socket.id} marked as inactive.`
//       );
//     }
//   });
// });

// console.log("Socket io from chat");

// // io.listen(3001, () => console.log("Socket.IO server listening on port 3001"));
// server.listen(3000, () =>
//   console.log("🚀 WebSocket Server running on ws://localhost:3000")
// );
// export { io };


// Common js-
const http = require("http");
const { Server } = require("socket.io");
const { verifyToken } = require("../backend/authentication/jwt_token");
const { createShardedAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient } = require("./config/redisClient");
const { sendDirectMessageToSocket } = require("./utils/sendDirectMessageToSocket");
const { getReceiverSocketId } = require("./utils/getReceiverSocketId");
const sendOnlineUpdateToFriends = require("./utils/sendOnlineUpdateToFriends");
const { setIO } = require("./ioManager");

// const express = require("express");
// const app = express();


const server = http.createServer();
// const server = http.createServer(app);

// app.get("/", (req, res) => {
//   console.log('Socket server app')
//   res.send("🟢 Socket.IO server is live");
// });

const io = new Server(server, {
  adapter: createShardedAdapter(pubClient, subClient),
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setIO(io); // 👈 Initialize the global IO instance

// Redis Subscriptions
let isSubscribed = false;

if (!isSubscribed) {
  subClient.subscribe("chat_messages", (err) => {
    if (err) console.error("❌ Failed to subscribe to chat_messages");
    else console.log("✅ Subscribed to chat_messages");
  });

  subClient.subscribe("group_events", (err) => {
    if (err) console.error("❌ Failed to subscribe to group_events");
    else console.log("✅ Subscribed to group_events");
  });

  isSubscribed = true;
}

// Redis message listener
subClient.on("message", async (channel, message) => {
  try {
    const data = JSON.parse(message);

    if (channel === "chat_messages") {
      console.log("📨 Broadcasting message:", data);

      const recipientSockets = await getReceiverSocketId(data.message.recipients[0]);
      const senderSockets = await getReceiverSocketId(data.message.sender);

      sendDirectMessageToSocket("new_message", recipientSockets, data);
      sendDirectMessageToSocket("my_new_message", senderSockets, data);
    } else if (channel === "group_events" && data.type === "group_created") {
      const memberSockets = await getReceiverSocketIdList(data.data.members);
      sendDirectMessageToSocket("group_created", memberSockets, data.data);
    }
  } catch (err) {
    console.error(`❌ Error handling Redis message from ${channel}:`, err);
  }
});

// Socket middleware for JWT auth
io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.auth?.token;

    console.log('Socket middleware')
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("❌ Authentication error: Missing or malformed token"));
    }

    const token = authHeader.split("Bearer ")[1];
    const tokenData = await verifyToken(token);

    if (tokenData === "err_while_verifying_jwt") {
      return next(new Error("❌ Invalid token"));
    }

    socket.handshake.userId = tokenData._id;
    next();
  } catch (err) {
    console.error("❌ Middleware error:", err);
    next(new Error("❌ Authentication processing failed"));
  }
});

// Socket connection handler
io.on("connection", async (socket) => {
  const userId = socket.handshake.userId;
  console.log(`🔌 User connected: ${userId} (Socket ID: ${socket.id})`);

  if (userId) {
    const existingSockets = await pubClient.hgetall(`user_sockets:${userId}`);
    let reconnected = false;

    for (const socketId in existingSockets) {
      try {
        const socketData = JSON.parse(existingSockets[socketId]);

        if (socketData.status === "disconnected" && Date.now() - socketData.timestamp <= 300000) {
          await pubClient.hset(
            `user_sockets:${userId}`,
            socketId,
            JSON.stringify({ status: "connected", timestamp: Date.now() })
          );
          console.log(`🔁 Reconnected: ${userId} using socket ${socketId}`);
          reconnected = true;
        } else {
          await pubClient.hdel(`user_sockets:${userId}`, socketId);
          console.log(`🗑️ Removed stale socket: ${socketId} for user ${userId}`);
        }
      } catch (err) {
        await pubClient.hdel(`user_sockets:${userId}`, socketId);
        console.error(`❌ Error parsing stale socket data. Deleted ${socketId}`);
      }
    }

    if (!reconnected) {
      const multi = pubClient.multi();
      multi.hset(
        `user_sockets:${userId}`,
        socket.id,
        JSON.stringify({ status: "connected", timestamp: Date.now() })
      );
      multi.expire(`user_sockets:${userId}`, 86400);
      await multi.exec();
      console.log(`✅ Connected new socket for ${userId}: ${socket.id}`);
    }

    sendOnlineUpdateToFriends({ userId, status: "online" });
  }

  socket.on("userTyping", async (data) => {
    const sockets = await getReceiverSocketId(data.sendToOtherUser);
    sendDirectMessageToSocket("displayTyping", sockets, { username: data.username });
  });

  socket.on("userStoppedTyping", async (data) => {
    const sockets = await getReceiverSocketId(data.sendToOtherUser);
    sendDirectMessageToSocket("hideTyping", sockets, {
      userId,
      sendToOtherUser: data.sendToOtherUser,
    });
  });

  socket.on("disconnect", async () => {
    if (userId) {
      await pubClient.hset(
        `user_sockets:${userId}`,
        socket.id,
        JSON.stringify({ status: "disconnected", timestamp: Date.now() })
      );

      sendOnlineUpdateToFriends({ userId, status: "offline" });

      setTimeout(async () => {
        const socketData = await pubClient.hget(`user_sockets:${userId}`, socket.id);
        if (socketData) {
          const parsedData = JSON.parse(socketData);
          if (parsedData.status === "disconnected" && Date.now() - parsedData.timestamp > 300000) {
            await pubClient.hdel(`user_sockets:${userId}`, socket.id);
            console.log(`🗑️ Removed socket ${socket.id} after prolonged disconnection`);
          }
        }
      }, 300000);

      console.log(`🔌 User ${userId} temporarily disconnected (Socket ID: ${socket.id})`);
    }
  });
});

console.log("🚀 Socket.IO chat server initialized");
server.listen(3000, '0.0.0.0', () => console.log("✅ WebSocket server running on port 3000"));
