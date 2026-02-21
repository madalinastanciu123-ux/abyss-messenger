const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let users = {};
let lastMessageTime = {};

io.on("connection", (socket) => {

  socket.on("register_user", (username) => {

    if (users[username]) {
      socket.emit("username_taken");
      return;
    }

    users[username] = socket.id;
    socket.username = username;

    io.emit("user_joined", username);
  });

  socket.on("send_message", (data) => {

    const now = Date.now();

    if (lastMessageTime[socket.id] &&
        now - lastMessageTime[socket.id] < 1000) {
      return; // anti spam
    }

    lastMessageTime[socket.id] = now;

    io.emit("receive_message", {
      user: data.user,
      text: data.text
    });
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete users[socket.username];
      io.emit("user_left", socket.username);
    }
  });

});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server running...");
});
