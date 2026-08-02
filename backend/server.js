const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const activeUsers = require("./state/activeUsers");
const createTemporaryUser = require("./factories/createTemporaryUser");

const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "https://tots-jade.vercel.app",
];
const MAX_MESSAGE_LENGTH = 1_000;
const MESSAGE_WINDOW_MS = 5_000;
const MAX_MESSAGES_PER_WINDOW = 20;

function createChatServer(options = {}) {
  const app = express();
  const server = http.createServer(app);
  const origins = options.origins || (process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(",").map((origin) => origin.trim())
    : DEFAULT_ORIGINS);

  app.use(cors({ origin: origins, credentials: true }));
  app.get("/health", (_request, response) => {
    response.json({ ok: true, online: io.engine.clientsCount });
  });

  const io = new Server(server, {
    cors: { origin: origins, methods: ["GET", "POST"], credentials: true },
  });
  const waitingQueue = [];
  const waitingSet = new Set();

  function broadcastPresence() {
    io.emit("presence", { online: io.engine.clientsCount });
  }

  function removeFromQueue(socketId) {
    if (!waitingSet.delete(socketId)) return;
    const index = waitingQueue.indexOf(socketId);
    if (index !== -1) waitingQueue.splice(index, 1);
  }

  function leaveSession(socket, reason = "left") {
    removeFromQueue(socket.id);
    const roomId = socket.data.roomId;
    const user = activeUsers.get(socket.id);

    if (user) {
      user.status = "idle";
      user.currentRoomId = null;
      user.lastActiveAt = Date.now();
      if (reason === "next" && roomId) user.statistics.chatsSkipped += 1;
    }

    if (!roomId) return;

    socket.data.roomId = null;
    socket.to(roomId).emit("partner_left", { reason });
    socket.leave(roomId);
  }

  function nextWaitingSocket(excludeId) {
    while (waitingQueue.length) {
      const candidateId = waitingQueue.shift();
      waitingSet.delete(candidateId);
      const candidate = io.sockets.sockets.get(candidateId);
      if (candidate && candidate.connected && candidate.id !== excludeId && !candidate.data.roomId) {
        return candidate;
      }
    }
    return null;
  }

  function enqueue(socket) {
    if (waitingSet.has(socket.id)) return;
    waitingSet.add(socket.id);
    waitingQueue.push(socket.id);
    const user = activeUsers.get(socket.id);
    if (user) {
      user.status = "waiting";
      user.currentRoomId = null;
      user.lastActiveAt = Date.now();
    }
    socket.emit("match_waiting");
  }

  io.on("connection", (socket) => {
    const temporaryUser = createTemporaryUser(socket.id);
    activeUsers.set(socket.id, temporaryUser);
    socket.data.roomId = null;
    socket.data.messageTimes = [];
    broadcastPresence();

    socket.on("find_match", () => {
      const currentUser = activeUsers.get(socket.id);
      if (!currentUser) {
        socket.emit("server_error", { message: "Temporary user profile was not found." });
        return;
      }

      leaveSession(socket, "next");
      const partner = nextWaitingSocket(socket.id);

      if (!partner) {
        enqueue(socket);
        return;
      }

      const roomId = uuidv4();
      const partnerUser = activeUsers.get(partner.id);
      if (!partnerUser) {
        enqueue(socket);
        return;
      }

      socket.data.roomId = roomId;
      partner.data.roomId = roomId;
      socket.join(roomId);
      partner.join(roomId);

      const now = Date.now();
      currentUser.status = "chatting";
      currentUser.currentRoomId = roomId;
      currentUser.lastActiveAt = now;
      partnerUser.status = "chatting";
      partnerUser.currentRoomId = roomId;
      partnerUser.lastActiveAt = now;

      socket.emit("match_found", { roomId, myId: socket.id });
      partner.emit("match_found", { roomId, myId: partner.id });
    });

    socket.on("cancel_match", (acknowledge) => {
      leaveSession(socket, "cancelled");
      if (typeof acknowledge === "function") acknowledge({ ok: true });
    });

    socket.on("leave_chat", (acknowledge) => {
      leaveSession(socket, "left");
      if (typeof acknowledge === "function") acknowledge({ ok: true });
    });

    socket.on("send_message", (data, acknowledge) => {
      const fail = (code, message) => {
        const error = { ok: false, code, message };
        if (typeof acknowledge === "function") acknowledge(error);
        else socket.emit("chat_error", error);
      };

      if (!data || typeof data.text !== "string") {
        fail("INVALID_MESSAGE", "Message text is required.");
        return;
      }

      const text = data.text.trim();
      if (!text || text.length > MAX_MESSAGE_LENGTH) {
        fail("INVALID_MESSAGE", `Messages must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`);
        return;
      }

      const roomId = socket.data.roomId;
      if (!roomId || data.roomId !== roomId || !socket.rooms.has(roomId)) {
        fail("NOT_IN_ROOM", "You are no longer connected to this chat.");
        return;
      }

      const now = Date.now();
      socket.data.messageTimes = socket.data.messageTimes.filter(
        (timestamp) => now - timestamp < MESSAGE_WINDOW_MS,
      );
      if (socket.data.messageTimes.length >= MAX_MESSAGES_PER_WINDOW) {
        fail("RATE_LIMITED", "You are sending messages too quickly.");
        return;
      }
      socket.data.messageTimes.push(now);

      const currentUser = activeUsers.get(socket.id);
      if (!currentUser) {
        fail("PROFILE_NOT_FOUND", "Temporary user profile was not found.");
        return;
      }
      currentUser.lastActiveAt = now;
      currentUser.statistics.totalMessages += 1;

      io.to(roomId).emit("receive_message", {
        id: uuidv4(),
        senderId: socket.id,
        text,
        time: new Date(now).toISOString(),
      });
      if (typeof acknowledge === "function") acknowledge({ ok: true });
    });

    socket.on("report_partner", (details, acknowledge) => {
      const roomId = socket.data.roomId;
      if (!roomId) {
        if (typeof acknowledge === "function") acknowledge({ ok: false });
        return;
      }
      // This deliberately logs metadata, never message contents. Replace with durable
      // moderation storage before relying on reports across restarts or instances.
      console.warn("Partner report", {
        reporterId: socket.id,
        roomId,
        reason: typeof details?.reason === "string" ? details.reason.slice(0, 120) : "unspecified",
      });
      if (typeof acknowledge === "function") acknowledge({ ok: true });
    });

    if (process.env.NODE_ENV !== "production") {
      socket.on("get_my_profile", () => {
        socket.emit("my_profile", activeUsers.get(socket.id) || null);
      });
    }

    socket.on("disconnect", () => {
      leaveSession(socket, "disconnected");
      activeUsers.delete(socket.id);
      broadcastPresence();
    });
  });

  return { app, io, server };
}

if (require.main === module) {
  const { server } = createChatServer();
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = { createChatServer };
