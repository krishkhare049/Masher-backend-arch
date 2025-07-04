// // socket.js

// // // const cookieParser = require("cookie-parser");
// // const { Server } = require("socket.io"); // Importing the Server class from socket.io
// // // const {
// // //   extract_token_user_id,
// // // } = require("./middlewares/extract_token_user_id");
// // const { verifyToken } = require("./authentication/jwt_token");

// // const socketUser = [];

// // function setupSocket(server) {
// //   const io = new Server(server, {
// //     cors: {
// //       origin: "*", // Adjust this according to your needs
// //       methods: ["GET", "POST"],
// //       credentials: true,
// //     },
// //   });

// //   io.use(async (socket, next) => {
// //     // ...

// //     console.log("Middleware" + socket.id);

// //     // cookieParser()(socket.request, socket.request.res, (err)=>{
// //     //     if(err){
// //     //         return next(err)
// //     //     }

// //     //     const token = socket.request.auth.token;
// //     //     console.log('Token:', token)
// //     //     if(!token) return next(new Error("Authentication Error!"))

// //     // // Decode here and find user if needed

// //     // })

// //     // console.log(socket.handshake.auth.token)

// //     const auth = socket.handshake.auth;

// //     if (auth && auth.token) {
// //       const token = socket.handshake.auth.token._j;
// //       const token_data = await verifyToken(token);
// //       console.log(token_data);

// //       if (token_data == "err_while_verifying_jwt") {
// //         //   req.user_id = "no_id";
// //         console.log("Error while verifying jwt");
// //       } else {
// //         //  Adding custom data to the socket object
// //         const user_id = token_data._id;
// //         socket.handshake.userId = user_id;

// //         next();
// //       }
// //     }

// //     // next();
// //   });

// //   io.on("connection", (socket) => {
// //     console.log("A user connected");
// //     // console.log(socket.id);
// //     // console.log(socket.handshake.auth.token);
// //     // const token = JSON.stringify(socket.handshake.auth.token._j); // _j is json with padding, socket io is using it internally
// //     // console.log(token);

// //     socketUser.push({ id: socket.id, userId: socket.handshake.userId });
// //     console.log(socketUser);

// //     // io.to(socket.id).emit('hi', 'krish');
// //     socket.emit("welcome", { id: socket.id });

// //     // Emit a message to the client (including the sender), use socket.to() to exclude the sender
// //     // setTimeout(() => {
// //         io
// //         .to(socket.id)
// //         .emit("welcome_alone", { message: "Welcome to the server" });
// //     // }, 5000);

// //     // Handle events
// //     socket.on("disconnect", () => {
// //       console.log("User  disconnected");
// //     });

// //     // You can also listen for custom events here
// //     socket.on("userId", (data) => {
// //       console.log("Custom event received:", data);

// //       // Emit a response back to the client if needed
// //       socket.emit("responseEvent", { message: "Response from server" });
// //     });
// //   });
// // }

// // module.exports = { setupSocket }; // Exporting the setupSocket function

// // import { createCluster } from "redis";
// // const { createCluster } = require("redis");
// // const Redis = require("ioredis");
// // const { Server } = require("socket.io"); // Importing the Server class from socket.io
// // const { createAdapter } = require("@socket.io/redis-adapter");

// // const { verifyToken } = require("./authentication/jwt_token");
// // const redis = require("./redisClient");

// const { SOCKETIO_PORT } = process.env;
// // const PORT = process.env.PORT || SOCKETIO_PORT;

// // const pubClient = createCluster({
// //   rootNodes: [
// //     {
// //       url: "redis://localhost:7000",
// //     },
// //     {
// //       url: "redis://localhost:7001",
// //     },
// //     {
// //       url: "redis://localhost:7002",
// //     },
// //   ],
// // });
// // const subClient = pubClient.duplicate();

// // await Promise.all([pubClient.connect(), subClient.connect()]);

// // Redis Client
// // const redisClient = redis.createClient({ host: "localhost", port: 6379 });
// // const redisClient = Redis.createClient({ host: "172.20.248.51", port: 6379 });
// // redisClient.on("error", (err) => console.error("Redis Error:", err));

// // console.log("Socket server running...");

// // import { createClient } from "redis";
// // import { Server } from "socket.io";
// // import { createAdapter } from "@socket.io/redis-adapter";

// // const pubClient = createClient({ url: "redis://localhost:6379" });
// // const subClient = pubClient.duplicate();

// // await Promise.all([
// //   pubClient.connect(),
// //   subClient.connect()
// // ]);

// // import { createClient } from "redis";
// import { Server } from "socket.io";
// import { verifyToken } from "./authentication/jwt_token.js";
// import { createShardedAdapter } from "@socket.io/redis-adapter";
// import { pubClient, subClient } from "./config/redisClient.js";

// // // const pubClient = createClient({ host: "localhost", port: 6379 });
// // const pubClient = createClient({
// //   socket: {
// //     host: "localhost",
// //     port: 6379,
// //   },
// // });
// // const subClient = pubClient.duplicate();

// // await Promise.all([pubClient.connect(), subClient.connect()]);

// // pubClient.on("error", (err) => console.error("Redis PubClient Error:", err));
// // subClient.on("error", (err) => console.error("Redis SubClient Error:", err));

// // const io = new Server({
// //   adapter: createShardedAdapter(pubClient, subClient)
// // });

// // io.listen(3000);

// const io = new Server({
//   adapter: createShardedAdapter(pubClient, subClient),
//   cors: {
//     origin: "*", // Adjust this according to your needs
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.use(async (socket, next) => {
//   // ...

//   console.log("Middleware socket Id: " + socket.id);

//   // cookieParser()(socket.request, socket.request.res, (err)=>{
//   //     if(err){
//   //         return next(err)
//   //     }
//   //     const token = socket.request.auth.token;
//   //     console.log('Token:', token)
//   //     if(!token) return next(new Error("Authentication Error!"))
//   // // Decode here and find user if needed
//   // })
//   // console.log(socket.handshake.auth.token)

//   const auth = socket.handshake.auth;

//   if (auth && auth.token) {
//     const token = socket.handshake.auth.token._j;
//     const token_data = await verifyToken(token);
//     console.log(token_data);

//     if (token_data == "err_while_verifying_jwt") {
//       //   req.user_id = "no_id";
//       console.log("Error while verifying jwt");
//     } else {
//       //  Adding custom data to the socket object
//       const user_id = token_data._id;
//       socket.handshake.userId = user_id;

//       next();
//     }
//   }

//   // next();
// });

// io.on("connection", async (socket) => {
//   console.log("A user connected");
//   // console.log(socket.id);
//   // console.log(socket.handshake.auth.token);
//   // const token = JSON.stringify(socket.handshake.auth.token._j); // _j is json with padding, socket io is using it internally
//   // console.log(token);

//   //
//   const userId = socket.handshake.userId; // Get userId from frontend

//   if (userId) {
//     // Store socket ID in Redis
//     // await redisClient.set(`user:${userId}`, socket.id);
//     // Store socket ID
//     await pubClient.hSet(`user_sockets:${userId}`, socket.id, "connected");
//     console.log(`User ${userId} connected with socket ID ${socket.id}`);
//   }
//   //

//   // socketUser.push({ id: socket.id, userId: socket.handshake.userId });
//   // console.log(socketUser);

//   // io.to(socket.id).emit('hi', 'krish');
//   socket.emit("welcome", { id: socket.id });

//   // Emit a message to the client (including the sender), use socket.to() to exclude the sender
//   // setTimeout(() => {
//   io.to(socket.id).emit("welcome_alone", { message: "Welcome to the server" });
//   // }, 5000);

//   // Handle events
//   socket.on("anyEvent", async () => {
//     // Retrieve all active socket IDs for this user
//     const sockets = await pubClient.hKeys(`user:${userId}`);
//     console.log(`All active sockets for user ${userId}:`, sockets);
//     // --- Any operation ---
//   });

//   socket.on("disconnect", async () => {
//     // await redis.del(`user:${userId}`);
//     await pubClient.hDel(`user_sockets:${userId}`, socket.id);
//     console.log(`User ${userId} disconnected`);
//   });
// });

// io.listen(3000, () => console.log("Socket.IO server listening on port 3000"));

// module.exports = { io, pubClient, subClient };

console.log("Socket js file")