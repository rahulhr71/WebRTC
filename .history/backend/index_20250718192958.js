// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rooms = {};
const app = express();
const roomPasswords = {};
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push(socket.id);


    io.to(roomId).emit('participants', rooms[roomId]);


    socket.on('disconnect', () => {
        rooms[roomId] = rooms[roomId]?.filter(id => id !== socket.id);
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        } else {
            io.to(roomId).emit('participants', rooms[roomId]);
        }
    });
    socket.on('leave-room', ({ roomId }) => {
        socket.leave(roomId);
        rooms[roomId] = rooms[roomId]?.filter(id => id !== socket.id);

        if (rooms[roomId]?.length === 0) {
            delete rooms[roomId];
            delete roomPasswords[roomId];
            io.to(roomId).emit('room-ended');
        } else {
            io.to(roomId).emit('participants', rooms[roomId]);
        }
    });
    socket.on('end-room', ({ roomId }) => {
        const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
        if (socketsInRoom) {
            for (const id of socketsInRoom) {
                const clientSocket = io.sockets.sockets.get(id);
                clientSocket?.leave(roomId);
                clientSocket?.emit('room-ended');
            }
            delete rooms[roomId];
            delete roomPasswords[roomId];
        }
    });
    socket.on('send-message', ({ roomId, sender, message }) => {
        io.to(roomId).emit('receive-message', {
            sender,
            message,
            time: new Date().toLocaleTimeString(),
        });
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
    socket.on('create-room', ({ roomId, password }) => {
        roomPasswords[roomId] = password;
        socket.join(roomId);
        socket.emit('room-created', { success: true });
    });
    socket.on('join-room', ({ roomId, password }) => {
        if (!roomPasswords[roomId]) {
            socket.emit('join-response', { success: false, message: "Room does not exist." });
            return;
        }

        if (roomPasswords[roomId] !== password) {
            socket.emit('join-response', { success: false, message: "Incorrect password." });
            return;
        }

        socket.join(roomId);
        socket.emit('join-response', { success: true });
        io.to(roomId).emit('participants', Array.from(io.sockets.adapter.rooms.get(roomId)));
    });

});

server.listen(5000, () => console.log('Signaling server running on 5000'));
