const test = require("node:test");
const assert = require("node:assert/strict");
const { io: createClient } = require("../../frontend/node_modules/socket.io-client");
const { createChatServer } = require("../server");

function once(socket, event, timeout = 2_000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${event}`)), timeout);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

test("matches two users, validates rooms, and ends the old session", async (t) => {
  const { server } = createChatServer({ origins: ["http://localhost"] });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const clients = [];
  t.after(() => {
    clients.forEach((client) => client.disconnect());
    server.close();
  });

  const connect = async () => {
    const client = createClient(url, { forceNew: true });
    clients.push(client);
    await once(client, "connect");
    return client;
  };

  const first = await connect();
  const second = await connect();
  first.emit("find_match");
  await once(first, "match_waiting");
  const firstMatched = once(first, "match_found");
  const secondMatched = once(second, "match_found");
  second.emit("find_match");
  const [firstSession, secondSession] = await Promise.all([firstMatched, secondMatched]);
  assert.equal(firstSession.roomId, secondSession.roomId);

  const received = once(first, "receive_message");
  const acknowledgement = await new Promise((resolve) => {
    second.emit("send_message", { roomId: secondSession.roomId, text: " hello " }, resolve);
  });
  assert.equal(acknowledgement.ok, true);
  assert.equal((await received).text, "hello");

  const invalid = await new Promise((resolve) => {
    second.emit("send_message", { roomId: "made-up-room", text: "nope" }, resolve);
  });
  assert.equal(invalid.code, "NOT_IN_ROOM");

  const partnerLeft = once(first, "partner_left");
  await new Promise((resolve) => second.emit("leave_chat", resolve));
  assert.equal((await partnerLeft).reason, "left");
});

test("deduplicates waiting users and skips disconnected entries", async (t) => {
  const { server } = createChatServer({ origins: ["http://localhost"] });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const clients = [];
  t.after(() => {
    clients.forEach((client) => client.disconnect());
    server.close();
  });
  const connect = async () => {
    const client = createClient(url, { forceNew: true });
    clients.push(client);
    await once(client, "connect");
    return client;
  };

  const stale = await connect();
  stale.emit("find_match");
  await once(stale, "match_waiting");
  stale.disconnect();

  const first = await connect();
  first.emit("find_match");
  await once(first, "match_waiting");
  first.emit("find_match");
  await once(first, "match_waiting");

  const second = await connect();
  const matchA = once(first, "match_found");
  const matchB = once(second, "match_found");
  second.emit("find_match");
  const [sessionA, sessionB] = await Promise.all([matchA, matchB]);
  assert.equal(sessionA.roomId, sessionB.roomId);
});
