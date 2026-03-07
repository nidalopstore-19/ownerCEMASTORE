const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => {
    console.log('✅ BOT NIDALOP SUDAH AKTIF DI GRUP!');
});

// Fitur Pairing Code
client.on('qr', async () => {
    // Ganti nomor di bawah dengan nomor WA bot kamu (pakai format 628xxx)
    const nomorWA = "628123456789"; 
    
    try {
        const code = await client.requestPairingCode(nomorWA);
        console.log('------------------------------');
        console.log('MASUKKAN KODE INI DI WA KAMU:');
        console.log('👉 ' + code + ' 👈');
        console.log('------------------------------');
    } catch (err) {
        console.log('Gagal meminta Pairing Code', err);
    }
});

// Kirim Notif ke Grup
app.post('/kirim-notif-grup', async (req, res) => {
    const { pesan } = req.body;
    // Ganti ID Grup ini setelah kamu dapatkan via !id
    const GROUP_ID = '1234567890@g.us'; 

    try {
        await client.sendMessage(GROUP_ID, pesan);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

// Cek ID Grup otomatis
client.on('message', async (msg) => {
    if (msg.body === '!id') {
        msg.reply('ID Grup: ' + msg.from);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Mesin jalan di port ' + port);
    client.initialize();
});
