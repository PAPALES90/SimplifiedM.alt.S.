const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Mesajları hafızada tutacağımız liste
let mesajGecmisi = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // Yeni biri bağlandığında geçmişi ona gönder
    socket.emit('gecmis-mesajlar', mesajGecmisi);

    socket.on('yeni-kullanici', (isim) => {
        socket.username = isim;
        const girisMesaji = { kimden: 'Sistem', icerik: isim + ' sohbete katıldı.', zaman: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) };
        mesajGecmisi.push(girisMesaji);
        io.emit('mesaj', girisMesaji);
    });

    socket.on('mesaj', (data) => {
        const mesajObjesi = { 
            kimden: data.kimden, 
            icerik: data.icerik, 
            zaman: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) 
        };
        mesajGecmisi.push(mesajObjesi);
        io.emit('mesaj', mesajObjesi);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu tam gaz çalışıyor!'));
