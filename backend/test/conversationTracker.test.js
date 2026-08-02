const test = require("node:test");
const assert = require("node:assert/strict");
const createTemporaryChat = require("../factories/createTemporaryChat");
const {
  countWords,
  containsQuestion,
  recordMessage,
  finishChat,
  createConversationSummary,
} = require("../services/conversationTracker");

test("creates a valid temporary chat", () => {
  const chat = createTemporaryChat("room-1", "user-a", "user-b");
  assert.deepEqual(chat.participants, ["user-a", "user-b"]);
  assert.equal(chat.status, "active");
  assert.equal(chat.messages.length, 0);
  assert.throws(
    () => createTemporaryChat("room-2", "same-user", "same-user"),
    /Two distinct participant/,
  );
});

test("counts words and detects questions", () => {
  assert.equal(countWords("  Hello   there friend  "), 3);
  assert.equal(countWords(""), 0);
  assert.equal(containsQuestion("How are you?"), true);
  assert.equal(containsQuestion("I am fine"), false);
});

test("records message statistics and response times", () => {
  const chat = createTemporaryChat("room-3", "user-a", "user-b");
  recordMessage(chat, "user-a", "How are you?", 1_000);
  const reply = recordMessage(chat, "user-b", "I am well", 4_000);

  assert.equal(chat.participantStats["user-a"].messageCount, 1);
  assert.equal(chat.participantStats["user-a"].questionCount, 1);
  assert.equal(chat.participantStats["user-a"].wordCount, 3);
  assert.equal(reply.responseTimeMs, 3_000);
  assert.deepEqual(chat.participantStats["user-b"].responseTimes, [3_000]);
});

test("does not treat consecutive messages or long delays as responses", () => {
  const chat = createTemporaryChat("room-4", "user-a", "user-b");
  recordMessage(chat, "user-a", "Hello", 1_000);
  recordMessage(chat, "user-a", "Are you there?", 3_000);
  recordMessage(chat, "user-b", "Sorry", 304_000);

  assert.deepEqual(chat.participantStats["user-a"].responseTimes, []);
  assert.deepEqual(chat.participantStats["user-b"].responseTimes, []);
});

test("finishes and summarizes a chat idempotently", () => {
  const chat = createTemporaryChat("room-5", "user-a", "user-b");
  chat.startedAt = 1_000;
  recordMessage(chat, "user-a", "Hello", 2_000);
  recordMessage(chat, "user-b", "Hi there", 5_000);
  finishChat(chat, "user-a", "next_person", 11_000);
  finishChat(chat, "user-b", "connection_lost", 12_000);
  const summary = createConversationSummary(chat);

  assert.equal(summary.durationMs, 10_000);
  assert.equal(summary.totalMessages, 2);
  assert.equal(summary.endedBy, "user-a");
  assert.equal(summary.endReason, "next_person");
  assert.equal(summary.participants["user-b"].averageResponseTimeMs, 3_000);
});

test("rejects messages from outsiders and ended chats", () => {
  const chat = createTemporaryChat("room-6", "user-a", "user-b");
  assert.throws(() => recordMessage(chat, "outsider", "Hello"), /not a participant/);
  finishChat(chat, "user-a", "left");
  assert.throws(() => recordMessage(chat, "user-a", "Again"), /inactive chat/);
});
