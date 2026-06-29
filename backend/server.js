const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const waitingUsers = require("./waitingQueue");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tots-jade.vercel.app"
    ],
    credentials: true
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://tots-jade.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  socket.on("find_match", () => {

    if (waitingUsers.length > 0) {

      const partner = waitingUsers.shift();

      const roomId = uuidv4();

      socket.join(roomId);

      const partnerSocket =
        io.sockets.sockets.get(partner);

      if (partnerSocket) {

        partnerSocket.join(roomId);

        socket.emit("match_found", {
          roomId,
          myId: socket.id
        });

        partnerSocket.emit("match_found", {
          roomId,
          myId: partnerSocket.id
        });

        console.log(
          `Matched ${socket.id} and ${partner}`
        );
      }

    } else {

      waitingUsers.push(socket.id);

      console.log(
        `${socket.id} waiting...`
      );
    }
  });

  socket.on("send_message", (data) => {

    io.to(data.roomId).emit("receive_message", {
      senderId: socket.id,
      text: data.text,
      time: data.time
    });

  });

  socket.on(
    "disconnect",
    () => {

      const index =
        waitingUsers.indexOf(socket.id);

      if (index !== -1) {

        waitingUsers.splice(index, 1);

      }

      console.log(
        "Disconnected:",
        socket.id
      );
    }
  );

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});