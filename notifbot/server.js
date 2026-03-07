const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let pairingCodeRequested = false;
const ID_GRUP_STORE = "120363404036911585@g.us"; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => {
    console.log('✅ NIDA-BOOT SUDAH AKTIF!');
});

// --- FITUR DYNAMIC PAIRING (Kaya Panel) ---
app.get('/request-pairing', async (req, res) => {
    const nomorWA = req.query.number; // Ambil nomor dari link: ?number=62xxx
    if (!nomorWA) return res.send("Masukkan nomor tlp di link! Contoh: /request-pairing?number=628xxx");

    try {
        const code = await client.requestPairingCode(nomorWA);
        res.send(`<h1>KODE PAIRING KAMU: ${code}</h1><p>Masukkan kode ini di WA kamu sekarang.</p>`);
        console.log(`KODE PAIRING UNTUK ${nomorWA}: ${code}`);
    } catch (err) {
        res.status(500).send("Gagal minta kode. Pastikan bot belum login.");
    }
});

// --- ENDPOINT NOTIF PEMBELIAN ---
app.post('/kirim-notif-grup', async (req, res) => {
    const { nama, produk, harga } = req.body;
    const teksPesan = `*NIDALOP-BOOT NOTIF* 🚀\n\n` +
                      `🔥 *ADA PEMBELIAN BARU!* 🔥\n` +
                      `👤 Buyer  : ${nama}\n` +
                      `📦 Produk : *${produk}*\n` +
                      `💰 Harga  : Rp ${parseInt(harga).toLocaleString('id-ID')}\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━`;

    try {
        await client.sendMessage(ID_GRUP_STORE, teksPesan);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Mesin Ready! Silahkan request pairing via browser.');
    client.initialize();
});
