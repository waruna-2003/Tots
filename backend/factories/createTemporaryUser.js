const { randomUUID } = require("node:crypto");

function createTemporaryUser(socketId) {
  if (!socketId || typeof socketId !== "string") {
    throw new Error("A valid socket ID is required");
  }

  const now = Date.now();

  return {
    sessionId: randomUUID(),
    socketId,
    status: "idle",
    currentRoomId: null,
    profile: {
      positivity: 5,
      sociability: 5,
      responseSpeed: 5,
      messageDetail: 5,
      questionFrequency: 5,
      emotionalIntensity: 5,
      persistence: 5,
      respectfulness: 5,
    },
    interests: {},
    statistics: {
      chatsCompleted: 0,
      chatsSkipped: 0,
      totalMessages: 0,
      averageChatDurationMs: 0,
      averageResponseTimeMs: 0,
    },
    createdAt: now,
    lastActiveAt: now,
  };
}

module.exports = createTemporaryUser;
