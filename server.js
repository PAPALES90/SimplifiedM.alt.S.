const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Bir cihaz bağlandı.');
    
    socket.on('yeni-kullanici', (isim) => {
        socket.username = isim;
        io.emit('mesaj', {kimden: 'Sistem', icerik: isim + ' sohbete katıldı.'});
    });

    socket.on('mesaj', (data) => {
        io.emit('mesaj', data);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ayakta!');
});