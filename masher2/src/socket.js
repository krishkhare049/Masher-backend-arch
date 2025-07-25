// import * as SecureStore from "expo-secure-store";

// import { io } from "socket.io-client";
// let SOCKETIO_URL = process.env.SOCKETIO_URL;
// // export const socket = io('http://192.168.179.88:5000');

// // const token = SecureStore.getItemAsync("secure_token");

// const getToken = async () => {
//   try {
//     console.log("🔹 SOCKETIO_URL:", SOCKETIO_URL);
//     const token = await SecureStore.getItemAsync("secure_token");
//     console.log("🔹 Token from SecureStore:", token);
//     // return token || "noToken"; // Ensure it returns a string
//     return JSON.stringify(token) || "noToken"; // Ensure it returns a string
//   } catch (error) {
//     console.error("❌ Error retrieving token:", error);
//     return "noToken"; // Return a default value if an error occurs
//   }
// };

// // I am exporting only socket so only it will run not console.log
// // console.log("token::" + token);
// // export const socket = io(SOCKETIO_URL, {
// export const socket = io("http://192.168.182.127:3000", {
//   transports: ["websocket"],
//   reconnectionAttempts: 5,
//   timeout: 10000,
//   // auth: {
//   //   // token: token?.toString()
//   //   // token: token || "noToken",
//   //   token: getToken(),
//   // },
//   extraHeaders: {
//     Authorization: "Bearer " + getToken(),
//   },
//   withCredentials: true,
// });


// import * as SecureStore from "expo-secure-store";
// import { io } from "socket.io-client";

// const SOCKETIO_URL = "http://192.168.182.127:3000"; // Your server URL

// const getToken = async () => {
//   try {
//     const token = await SecureStore.getItemAsync("secure_token");
//     console.log("🔹 Token from SecureStore:", token);
//     return token || "noToken"; // Ensure a string is returned
//   } catch (error) {
//     console.error("❌ Error retrieving token:", error);
//     return "noToken"; // Return a default value if an error occurs
//   }
// };

// let socket; // Define socket outside so it can be used globally

// const initializeSocket = async () => {
//   const token = await getToken();
//   console.log("🔹 Using Token in Socket:", token);

//   socket = io(SOCKETIO_URL, {
//     transports: ["websocket"],
//     reconnectionAttempts: 5,
//     timeout: 10000,
//     extraHeaders: {
//       Authorization: `Bearer ${token}`, // Now token is properly awaited
//     },
//     withCredentials: true,
//   });

//   return socket;
// };

// // ✅ Call the function to initialize the socket
// initializeSocket();

// // ✅ Export socket so it can be used in other files
// export { socket };

import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";

// Declare the socket globally
let socket = null;

const SOCKETIO_URL = "http://192.168.130.127:3000"; // Your server URL

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("secure_token");
    console.log("🔹 Token from SecureStore:", token);
    return token || "noToken"; // Ensure a string is returned
  } catch (error) {
    console.error("❌ Error retrieving token:", error);
    return "noToken"; // Return a default value if an error occurs
  }
};

// Function to initialize the socket if not already initialized
const initializeSocket = async () => {
  if (!socket) { // Prevent multiple socket connections
    const token = await getToken();
    console.log("🔹 Using Token in Socket:", token);

    socket = io(SOCKETIO_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Now token is properly awaited
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });
  }

  return socket; // Return the socket instance
};

// Export the function to initialize the socket
export { initializeSocket, socket };