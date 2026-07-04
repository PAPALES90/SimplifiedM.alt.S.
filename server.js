var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(__dirname));

io.on('connection', function(socket) {
    socket.on('login', function(name) {
        socket.username = name;
    });

    socket.on('chat message', function(data) {
        io.emit('chat message', {
            isim: socket.username,
            mesaj: data
        });
    });
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('Sunucu calisiyor: ' + port);
});
