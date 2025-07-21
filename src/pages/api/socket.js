// src/pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already running");
    res.end();
    return;
  }

  console.log("Starting Socket.IO server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle messages
    socket.on("send-message", (msg) => {
      // Send to recipient
      io.emit("receive-message", msg); // You can make this room-based later
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  res.end();
}
