const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('login', (name) => socket.username = name);
    socket.on('chat', (data) => {
        io.emit('chat', { user: socket.username, msg: data, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    });
});

http.listen(process.env.PORT || 3000);
