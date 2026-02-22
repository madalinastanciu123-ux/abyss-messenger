const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    // trimite mesajul tuturor
    io.emit("receive_message", data);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
