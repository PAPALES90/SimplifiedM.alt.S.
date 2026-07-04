var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', function(socket) {
    socket.on('login', function(name) { socket.username = name; });
    socket.on('chat', function(data) {
        io.emit('chat', data);
    });
});

http.listen(process.env.PORT || 3000);
