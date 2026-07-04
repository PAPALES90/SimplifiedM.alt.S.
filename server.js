<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { background: #0f2027; color: white; font-family: sans-serif; margin: 0; }
        #login { position:fixed; top:0; width:100%; height:100%; background: #203a43; display:flex; justify-content:center; align-items:center; z-index:100; }
        #chat-ui { display:none; height:100vh; display:flex; flex-direction:column; }
        #chat { flex:1; overflow-y:auto; padding:15px; }
        
        /* Balon Tasarımı */
        .msg { background: #34495e; padding: 10px 15px; margin-bottom: 10px; border-radius: 20px; border-bottom-left-radius: 0; max-width: 80%; width: fit-content; }
        .own { background: #27ae60; align-self: flex-end; border-bottom-left-radius: 20px; border-bottom-right-radius: 0; margin-left: auto; }
        
        .admin-tag { color: #ff4d4d; font-weight: bold; margin-left: 5px; }
        .zaman { font-size: 0.7em; color: #bdc3c7; display: block; margin-top: 5px; }
        #status { font-size: 0.8em; color: #f1c40f; height: 20px; padding: 5px; }
    </style>
</head>
<body>
    <div id="login"><input id="isim" placeholder="Adın ne?"><button onclick="giris()">Giriş</button></div>
    <div id="chat-ui">
        <div id="chat"></div>
        <div id="status"></div>
        <div style="padding:10px; background:#203a43; display:flex;">
            <input id="mesaj" style="flex:1;" oninput="yaziyor()">
            <button onclick="gonder()">Gönder</button>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
    <script>
        var socket = io();
        
        // İsim rengi oluşturma (Hash fonksiyonu)
        function stringToColor(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
            var color = '#';
            for (var i = 0; i < 3; i++) {
                var value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
        }

        function giris() {
            window.kullanici = document.getElementById('isim').value;
            if(window.kullanici) {
                localStorage.setItem('kullaniciAdi', window.kullanici);
                document.getElementById('login').style.display = 'none';
                document.getElementById('chat-ui').style.display = 'flex';
                socket.emit('yeni-kullanici', window.kullanici);
            }
        }

        // Yazıyor özelliği
        function yaziyor() {
            socket.emit('yaziyor', window.kullanici);
        }
        socket.on('yaziyor', (isim) => {
            document.getElementById('status').innerText = isim + " yazıyor...";
            setTimeout(() => { document.getElementById('status').innerText = ""; }, 2000);
        });

        function gonder() {
            var input = document.getElementById('mesaj');
            var val = input.value.trim();
            
            // Komut Sistemi
            if(val === "/temizle") { document.getElementById('chat').innerHTML = ""; input.value = ""; return; }
            if(val === "/saat") { alert("Saat: " + new Date().toLocaleTimeString()); input.value = ""; return; }

            socket.emit('mesaj', {kimden: window.kullanici, icerik: val});
            input.value = '';
        }

        function ekranaBas(data) {
            var div = document.createElement('div');
            div.className = 'msg' + (data.kimden === window.kullanici ? ' own' : '');
            var renk = stringToColor(data.kimden);
            var adminEtiketi = (data.kimden === 'PAPALES90') ? '<span class="admin-tag">[Yönetici]</span>' : '';
            div.innerHTML = `<strong style="color:${renk}">${data.kimden}</strong>${adminEtiketi}: ${data.icerik}<span class="zaman">${data.zaman}</span>`;
            document.getElementById('chat').appendChild(div);
            document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
        }

        socket.on('mesaj', ekranaBas);
        socket.on('gecmis-mesajlar', (liste) => { liste.forEach(ekranaBas); });
        
        // Enter tuşu
        document.getElementById("mesaj").addEventListener("keypress", (e) => { if(e.key === "Enter") gonder(); });
    </script>
</body>
</html>
