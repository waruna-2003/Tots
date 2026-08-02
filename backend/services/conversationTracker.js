function countWords(text) {
  if (typeof text !== "string") return 0;
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function containsQuestion(text) {
  return typeof text === "string" && text.includes("?");
}

function calculateResponseTime(chat, senderId, sentAt) {
  const previousMessage = chat.lastMessage;
  if (!previousMessage || previousMessage.senderId === senderId) return null;
  const responseTimeMs = sentAt - previousMessage.sentAt;
  if (responseTimeMs < 0 || responseTimeMs > 5 * 60 * 1000) return null;
  return responseTimeMs;
}

function recordMessage(chat, senderId, text, sentAt = Date.now()) {
  if (!chat) throw new Error("Chat is required");
  if (!chat.participants.includes(senderId)) {
    throw new Error("Sender is not a participant in this chat");
  }
  if (chat.status !== "active") throw new Error("Cannot add a message to an inactive chat");

  const trimmedText = String(text || "").trim();
  if (!trimmedText) throw new Error("Message text is required");

  const responseTimeMs = calculateResponseTime(chat, senderId, sentAt);
  const messageEvent = {
    senderId,
    text: trimmedText,
    sentAt,
    characterCount: trimmedText.length,
    wordCount: countWords(trimmedText),
    containsQuestion: containsQuestion(trimmedText),
    responseTimeMs,
  };
  chat.messages.push(messageEvent);

  const stats = chat.participantStats[senderId];
  stats.messageCount += 1;
  stats.characterCount += messageEvent.characterCount;
  stats.wordCount += messageEvent.wordCount;
  if (messageEvent.containsQuestion) stats.questionCount += 1;
  if (responseTimeMs !== null) stats.responseTimes.push(responseTimeMs);
  if (stats.firstMessageAt === null) stats.firstMessageAt = sentAt;
  stats.lastMessageAt = sentAt;
  chat.lastMessage = { senderId, sentAt };
  return messageEvent;
}

function finishChat(chat, endedBy, endReason, endedAt = Date.now()) {
  if (!chat) throw new Error("Chat is required");
  if (chat.status === "ended") return chat;
  chat.status = "ended";
  chat.endedAt = endedAt;
  chat.durationMs = Math.max(0, endedAt - chat.startedAt);
  chat.endedBy = endedBy || null;
  chat.endReason = endReason || "unknown";
  return chat;
}

function getAverage(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function createConversationSummary(chat) {
  if (!chat) throw new Error("Chat is required");
  const participants = {};
  for (const participantId of chat.participants) {
    const stats = chat.participantStats[participantId];
    participants[participantId] = {
      messageCount: stats.messageCount,
      averageMessageCharacters: stats.messageCount ? stats.characterCount / stats.messageCount : 0,
      averageMessageWords: stats.messageCount ? stats.wordCount / stats.messageCount : 0,
      questionFrequency: stats.messageCount ? stats.questionCount / stats.messageCount : 0,
      averageResponseTimeMs: getAverage(stats.responseTimes),
      firstMessageAt: stats.firstMessageAt,
      lastMessageAt: stats.lastMessageAt,
    };
  }
  return {
    roomId: chat.roomId,
    startedAt: chat.startedAt,
    endedAt: chat.endedAt,
    durationMs: chat.durationMs,
    totalMessages: chat.messages.length,
    endedBy: chat.endedBy,
    endReason: chat.endReason,
    participants,
  };
}

module.exports = {
  countWords,
  containsQuestion,
  calculateResponseTime,
  recordMessage,
  finishChat,
  createConversationSummary,
};
