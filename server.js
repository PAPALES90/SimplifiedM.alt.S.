const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let users = {};
let lastMessageTime = {};

io.on('connection', (socket) => {
    socket.on('login', (name) => {
        users[socket.id] = name;
        io.emit('updateUserList', Object.values(users));
    });

    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('userTyping', { name: users[socket.id], isTyping });
    });

    socket.on('chat message', (data) => {
        const now = Date.now();
        if (lastMessageTime[socket.id] && now - lastMessageTime[socket.id] < 2000) {
            return; // 2 saniye dolmadı, spam engellendi
        }
        lastMessageTime[socket.id] = now;

        io.emit('chat message', {
            isim: users[socket.id],
            mesaj: data.mesaj,
            renk: data.renk,
            zaman: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('updateUserList', Object.values(users));
    });
});

http.listen(process.env.PORT || 3000);
