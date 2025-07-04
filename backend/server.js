const http = require("http"); // Importing http module
const app = require("./app"); // Importing the app
// const { setupSocket } = require('./socket'); // Importing setupSocket function

// Uncomment the following lines if you want to use the cluster module
// const cluster = require("cluster");
const cluster = require("node:cluster");
const os = require("os");
let numcpu = os.cpus().length;
// console.log(`Number of CPUs: ${numcpu}`);

const { API_PORT } = process.env;

const PORT = process.env.PORT || API_PORT;
const server = http.createServer(app);

// Setting up Socket.IO
// setupSocket(server);

// We can use cluster module but for socketIO it may not behave correctly so we will optimize it later-

// if (cluster.isMaster) {

//       //Connect to the database only in the master process
//       connect().then(() => {
//         // Fork workers after DB is connected

//   for (let i = 0; i < numcpu; i++) {
//     cluster.fork();
//   }

// })

//   // If any worker killed-
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {

//   const server = http.createServer(app);

//   server.listen(PORT, () => {
//     console.log(
//       `Server ${process.pid} started on port http://localhost:${PORT}`
//     );
//     // console.log(`Server running on http://localhost:${PORT}`);
//   });
// }

// const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
// server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// But because i am using pm2 and it will handle the clustering so i will comment the cluster code and will use the server code only
// And so let's start connect() from app.js

// Note - it is ok to have one connection per instance of the app, but if you have multiple instances of the app running, you will have multiple connections to the database. This is not a problem for MongoDB, but it is for some other databases. If you are using a database that has a connection limit, you will need to manage the connections to ensure you don't exceed the limit.