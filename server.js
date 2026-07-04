const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı.');

    socket.on('mesaj', (data) => {
        io.emit('mesaj', {
            isim: data.isim,
            mesaj: data.mesaj,
            zaman: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı.');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
