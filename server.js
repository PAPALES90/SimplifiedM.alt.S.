const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Ana sayfayı gönder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Mesaj geçmişi hafızası
let mesajGecmisi = [];

io.on('connection', (socket) => {
    
    // Yeni kullanıcı katılınca
    socket.on('yeni-kullanici', (isim) => {
        io.emit('mesaj', {kimden: 'Sistem', icerik: isim + ' sohbete katıldı.', zaman: new Date().toLocaleTimeString()});
    });

    // Geçmiş mesajları yeni gelen kişiye gönder
    socket.emit('gecmis-mesajlar', mesajGecmisi);

    // Mesaj gelince
    socket.on('mesaj', (data) => {
        data.zaman = new Date().toLocaleTimeString();
        mesajGecmisi.push(data); // Mesajı hafızaya ekle
        io.emit('mesaj', data);
    });

    // Yazıyor özelliği
    socket.on('yaziyor', (isim) => {
        socket.broadcast.emit('yaziyor', isim);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu port ' + PORT + ' üzerinde çalışıyor!');
});
