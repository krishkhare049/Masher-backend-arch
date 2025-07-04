// // import { createClient } from "redis";
// // // import { createShardedAdapter } from "@socket.io/redis-adapter";

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

// // console.log("✅ Redis Clients Connected!");

// // export { pubClient, subClient };

// // import Redis from "ioredis";
// // import dotenv from "dotenv";

// // dotenv.config();

// // // Create a Redis client
// // const pubClient = new Redis({
// //   host: process.env.REDIS_HOST || "localhost",
// //   port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
// //   password: process.env.REDIS_PASSWORD || undefined,
// //   retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
// // });

// // // Create a separate Redis client for subscriptions
// // const subClient = new Redis({
// //   host: process.env.REDIS_HOST || "localhost",
// //   port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
// //   password: process.env.REDIS_PASSWORD || undefined,
// //   retryStrategy: (times) => Math.min(times * 50, 2000),
// // });

// // // Handle errors
// // pubClient.on("error", (err) => console.error("❌ Redis PubClient Error:", err));
// // subClient.on("error", (err) => console.error("❌ Redis SubClient Error:", err));

// // console.log("✅ ioredis Clients Connected!");

// // // Graceful shutdown
// // process.on("SIGINT", async () => {
// //   console.log("🛑 Closing Redis Connections...");
// //   pubClient.disconnect();
// //   subClient.disconnect();
// //   process.exit(0);
// // });

// // export { pubClient, subClient };

// // ///////////////////////////

// // // ✅ Create a single shared Redis client
// // const sharedRedisClient = new Redis({
// //   host: "127.0.0.1",
// //   port: 6379,
// //   maxRetriesPerRequest: null, // Prevents infinite retries
// // });

// // // ✅ Duplicate client for subscriptions (Redis requires a separate connection for pub/sub)
// // const subRedisClient = sharedRedisClient.duplicate();

// // // Handle errors
// // sharedRedisClient.on("error", (err) => console.error("❌ Redis PubClient Error:", err));
// // subRedisClient.on("error", (err) => console.error("❌ Redis SubClient Error:", err));

// // console.log("✅ Shared ioredis Clients Connected!");

// // // Graceful shutdown
// // process.on("SIGINT", async () => {
// //   console.log("🛑 Closing Redis Connections...");
// //   sharedRedisClient.disconnect();
// //   subRedisClient.disconnect();
// //   process.exit(0);
// // });

// // // Export the shared clients
// // export { sharedRedisClient as pubClient, subRedisClient as subClient };

// // ✅ Create a single shared Redis client
// import Redis from "ioredis";
// // import { Cluster } from "ioredis";
// import dotenv from "dotenv";
// // import cluster from "node:cluster";
// dotenv.config();

// let pubClient;
// let subClient;

// // ✅ Only create Redis clients in the MASTER process
// // if (cluster.isMaster) {
// pubClient = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null, // Prevents infinite retries
// });

// // ✅ Duplicate client for subscriptions (Redis requires a separate connection for pub/sub)
// subClient = pubClient.duplicate();

// // Handle errors
// pubClient.on("error", (err) => console.error("❌ Redis PubClient Error:", err));
// subClient.on("error", (err) => console.error("❌ Redis SubClient Error:", err));

// console.log("Shared ioredis Clients Connected!");

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("🛑 Closing Redis Connections...");
//   pubClient.disconnect();
//   subClient.disconnect();
//   process.exit(0);
// });

// // }

// // const pubClient = new Cluster([
// //   {
// //     host: "localhost",
// //     port: 7000,
// //   },
// //   {
// //     host: "localhost",
// //     port: 7001,
// //   },
// //   {
// //     host: "localhost",
// //     port: 7002,
// //   },
// // ]);

// // // ✅ Duplicate client for subscriptions (Redis requires a separate connection for pub/sub)
// // const subClient = pubClient.duplicate();

// // // Handle errors
// // pubClient.on("error", (err) => console.error("❌ Redis PubClient Error:", err));
// // subClient.on("error", (err) => console.error("❌ Redis SubClient Error:", err));

// // console.log("Shared ioredis Clients Connected!");

// // // Graceful shutdown
// // process.on("SIGINT", async () => {
// //   console.log("🛑 Closing Redis Connections...");
// //   pubClient.disconnect();
// //   subClient.disconnect();
// //   process.exit(0);
// // });

// // // Export the shared clients
// export { pubClient, subClient };

const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

let pubClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

let subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("❌ Redis PubClient Error:", err));
subClient.on("error", (err) => console.error("❌ Redis SubClient Error:", err));

console.log("Shared ioredis Clients Connected!");

process.on("SIGINT", async () => {
  console.log("🛑 Closing Redis Connections...");
  pubClient.disconnect();
  subClient.disconnect();
  process.exit(0);
});

module.exports = { pubClient, subClient };