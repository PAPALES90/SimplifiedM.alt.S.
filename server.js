var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

var history = []; // Mesajları burada saklıyoruz

io.on('connection', function(socket) {
    // Yeni kişi gelince ona eski mesajları gönder
    socket.emit('init', history);

    socket.on('login', function(name) {
        socket.username = name;
    });

    socket.on('chat', function(data) {
        var msgObj = { 
            user: socket.username, 
            msg: data.msg, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        };
        
        history.push(msgObj);
        if(history.length > 50) history.shift(); // Son 50 mesajı tut, daha fazlası şişirir
        
        io.emit('chat', msgObj);
    });
});

http.listen(process.env.PORT || 3000);
