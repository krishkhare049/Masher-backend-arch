// chat/ioManager.js
let io;

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
}

function setIO(newIO) {
  io = newIO;
}
module.exports = {
  getIO,
  setIO,
};