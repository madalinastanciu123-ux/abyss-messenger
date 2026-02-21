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

io.on("connection", (socket) => {

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (data) => {
    if (!data.room) return;

    io.to(data.room).emit("receive_message", {
      user: data.user,
      text: data.text
    });
  });

});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
