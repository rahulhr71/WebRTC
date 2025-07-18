// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rooms = {};
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });
  socket.on('chat-message', ({ roomId, sender, message }) => {
  io.to(roomId).emit('chat-message', { sender, message });
});
});

server.listen(5000, () => console.log('Signaling server running on 5000'));
