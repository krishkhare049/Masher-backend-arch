const { pubClient } = require("../../chat/config/redisClient");
export async function filterOnlineParticipants(participants) {
  const pipeline = pubClient.pipeline();

  // Queue hgetall for each participant
  for (const participant of participants) {
    pipeline.hgetall(`user_sockets:${participant.id}`);
  }

  const results = await pipeline.exec();
  const onlineParticipants = [];

  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i];
    const [err, sockets] = results[i];

    if (err || !sockets) continue;

    for (const [socketId, socketData] of Object.entries(sockets)) {
      try {
        const parsed = JSON.parse(socketData);
        if (parsed.status === "connected") {
          onlineParticipants.push(participant);
          break; // No need to check other sockets for this user
        }
      } catch (e) {
        console.error("Failed to parse socket JSON for", participant.id, e);
      }
    }
  }

  return onlineParticipants;
}