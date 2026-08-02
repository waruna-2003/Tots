function createTemporaryChat(roomId, participantA, participantB) {
  if (!roomId || typeof roomId !== "string") {
    throw new Error("A valid room ID is required");
  }
  if (!participantA || !participantB || participantA === participantB) {
    throw new Error("Two distinct participant socket IDs are required");
  }

  const now = Date.now();
  const createStats = () => ({
    messageCount: 0,
    characterCount: 0,
    wordCount: 0,
    questionCount: 0,
    responseTimes: [],
    firstMessageAt: null,
    lastMessageAt: null,
  });

  return {
    roomId,
    participants: [participantA, participantB],
    startedAt: now,
    endedAt: null,
    durationMs: null,
    status: "active",
    messages: [],
    participantStats: {
      [participantA]: createStats(),
      [participantB]: createStats(),
    },
    lastMessage: null,
    endedBy: null,
    endReason: null,
  };
}

module.exports = createTemporaryChat;
