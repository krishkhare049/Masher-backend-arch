// import { createClient } from "redis";
// // import { createShardedAdapter } from "@socket.io/redis-adapter";

// // const pubClient = createClient({ host: "localhost", port: 6379 });
// const pubClient = createClient({
//   socket: {
//     host: "localhost",
//     port: 6379,
//   },
// });
// const subClient = pubClient.duplicate();

// await Promise.all([pubClient.connect(), subClient.connect()]);

// pubClient.on("error", (err) => console.error("Redis PubClient Error:", err));
// subClient.on("error", (err) => console.error("Redis SubClient Error:", err));

// console.log("✅ Redis Clients Connected!");

// module.exports = {pubClient, s
// ubClient};
const Redis = require("ioredis");
const redis = new Redis({ host: "localhost", port: 6379 }); // Connects to Redis

module.exports = {redis};