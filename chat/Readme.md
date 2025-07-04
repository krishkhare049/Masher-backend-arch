There are two ways to connect io with application server while being separate-

If you're running your WebSocket server on a different port from your application server (API), you can still emit events from the API server to the WebSocket server using Redis Pub/Sub or a direct connection to the WebSocket server.

Method 1: Using Redis Pub/Sub (Best for Scalability)
This is the most scalable way because it allows multiple API and WebSocket servers to communicate even when running on different machines.

Architecture:
API server publishes events to Redis.
WebSocket server listens to Redis and emits messages to clients.
Tech Stack Required:
Redis (acts as a message broker)
Node.js (API & WebSocket server)
socket.io-redis (for handling WebSocket communication across multiple instances)
Implementation
1️⃣ Install Redis & Required Packages
sh
Copy
Edit
npm install ioredis socket.io socket.io-redis express
2️⃣ API Server (Express.js, Port 3000) - Publishes to Redis
javascript
Copy
Edit
const express = require("express");
const Redis = require("ioredis");

const app = express();
const redis = new Redis(); // Connects to Redis (default localhost:6379)

// Send a chat message (API call)
app.post("/send-message", (req, res) => {
    const message = { user: "Krish", text: "Hello, world!" };

    // Publish message to Redis
    redis.publish("chat_messages", JSON.stringify(message));

    res.json({ status: "Message sent" });
});

app.listen(3000, () => console.log("API Server running on port 3000"));
3️⃣ WebSocket Server (Socket.IO, Port 4000) - Subscribes to Redis & Emits Messages
javascript
Copy
Edit
const { Server } = require("socket.io");
const Redis = require("ioredis");

const io = new Server(4000, { cors: { origin: "*" } });
const redis = new Redis(); // Connects to Redis

io.on("connection", (socket) => {
    console.log("WebSocket connected");
});

// Subscribe to Redis channel
redis.subscribe("chat_messages", () => {
    console.log("Subscribed to chat_messages");
});

// Listen for messages from Redis and emit to clients
redis.on("message", (channel, message) => {
    if (channel === "chat_messages") {
        io.emit("new_message", JSON.parse(message));
    }
});
How It Works?
✅ User sends a message via API → API publishes it to Redis
✅ WebSocket server listens to Redis → Broadcasts message to connected clients

This allows your API and WebSocket server to communicate without direct connection!

Method 2: Direct API → WebSocket Connection (For Small Apps, Less Scalable)
Instead of Redis, the API server can connect directly to the WebSocket server using Socket.IO client.

API Server (Express.js, Port 3000)
javascript
Copy
Edit
const express = require("express");
const { io } = require("socket.io-client");

const app = express();
const socket = io("http://localhost:4000"); // Connect to WebSocket server

app.post("/send-message", (req, res) => {
    const message = { user: "Krish", text: "Hello, world!" };
    
    // Emit message to WebSocket server
    socket.emit("message_from_api", message);

    res.json({ status: "Message sent" });
});

app.listen(3000, () => console.log("API Server running on port 3000"));
WebSocket Server (Socket.IO, Port 4000)
javascript
Copy
Edit
const { Server } = require("socket.io");

const io = new Server(4000, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("WebSocket connected");

    // Listen for messages from API server
    socket.on("message_from_api", (message) => {
        io.emit("new_message", message);
    });
});
Which One Should You Use?
Method	Best For	Scalability	Latency	Complexity
Redis Pub/Sub	Large apps, multiple servers	✅ Highly scalable	✅ Low	❌ Needs Redis setup
Direct API → WS	Small apps, single server	❌ Not scalable	✅ Low	✅ Simple
Recommendation for Khare Industries Chat App
➡ Use Redis Pub/Sub if you want scalability and plan to expand your chat app.
➡ Use Direct API → WS if you just need a basic setup for now.

Let me know if you need help setting up Redis in production!