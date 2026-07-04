var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

var history = [];

io.on('connection', function(socket) {
    socket.emit('init', history);
    socket.on('login', function(name) { socket.username = name; });
    socket.on('chat', function(data) {
        var msgObj = { 
            user: socket.username, 
            msg: data.msg, 
            type: data.type, // 'text' veya 'image'
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        };
        history.push(msgObj);
        if(history.length > 50) history.shift();
        io.emit('chat', msgObj);
    });
});
http.listen(process.env.PORT || 3000);
