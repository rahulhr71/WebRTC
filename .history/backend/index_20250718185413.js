// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rooms = {};
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push(socket.id);

    // Notify all users in the room
    io.to(roomId).emit('participants', rooms[roomId]);

    // Handle disconnect
    socket.on('disconnect', () => {
      rooms[roomId] = rooms[roomId]?.filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('participants', rooms[roomId]);
      }
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
