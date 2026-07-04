var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

var history = []; // Mesajları burada tutacağız

io.on('connection', function(socket) {
    // Yeni kişi gelince eski mesajları gönder
    socket.emit('init', history);

    socket.on('login', function(name) {
        socket.username = name;
    });

    socket.on('chat', function(data) {
        var msgObj = { 
            user: socket.username, 
            msg: data, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        };
        
        history.push(msgObj);
        if(history.length > 50) history.shift(); // Hafızayı şişirmemek için son 50 mesajı tut
        
        io.emit('chat', msgObj);
    });
});

http.listen(process.env.PORT || 3000);
