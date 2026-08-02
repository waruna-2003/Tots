const test = require("node:test");
const assert = require("node:assert/strict");
const activeUsers = require("../state/activeUsers");
const createTemporaryUser = require("../factories/createTemporaryUser");

test.afterEach(() => activeUsers.clear());

test("creates a neutral temporary user profile", () => {
  const user = createTemporaryUser("socket-123");

  assert.equal(user.socketId, "socket-123");
  assert.equal(user.status, "idle");
  assert.equal(user.currentRoomId, null);
  assert.equal(user.profile.positivity, 5);
  assert.equal(user.profile.respectfulness, 5);
  assert.equal(user.statistics.totalMessages, 0);
  assert.match(user.sessionId, /^[0-9a-f-]{36}$/i);
  assert.equal(user.createdAt, user.lastActiveAt);
});

test("stores and removes a temporary user", () => {
  const user = createTemporaryUser("socket-456");
  activeUsers.set(user.socketId, user);

  assert.equal(activeUsers.has("socket-456"), true);
  activeUsers.delete("socket-456");
  assert.equal(activeUsers.has("socket-456"), false);
});

test("rejects an invalid socket ID", () => {
  assert.throws(() => createTemporaryUser(""), /valid socket ID is required/);
  assert.throws(() => createTemporaryUser(null), /valid socket ID is required/);
});
