const { Server } = require("socket.io");
const dotenv = require("dotenv");
const http = require("http");
const express = require("express");

const app = express();
dotenv.config();

// socket.io로 서버 생성
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
    methods: ["GET", "POST"],
  },
});

// 현재 socket에 연결된 유저id
const userSocketMap = {}; // {userId: socketId}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // client에 현재 온라인인 유저들의 userId 전송
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket 접속 종료시
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
