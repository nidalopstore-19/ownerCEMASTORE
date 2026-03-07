const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const ID_GRUP_STORE = "120363404036911585@g.us"; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => {
    console.log('✅ [NIDA-NOTF] SYSTEM ONLINE & READY!');
});

// --- DASHBOARD PAIRING NIDA-NOTF ---
app.get('/request-pairing', async (req, res) => {
    const nomorWA = req.query.number; 
    
    if (!nomorWA) {
        return res.send(`
            <body style="background:#0b0d0f; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
                <div style="text-align:center; padding:30px; border:1px solid #333; border-radius:20px; background:#161a1e;">
                    <h1 style="color:#ff3e3e; margin-bottom:10px;">NIDA-NOTF PANEL</h1>
                    <p style="color:#888;">Gunakan link: <code>/request-pairing?number=628xxx</code></p>
                </div>
            </body>
        `);
    }

    try {
        const code = await client.requestPairingCode(nomorWA);
        
        // Tampilan Mewah & Elegant ala NIDALOP STORE
        res.send(`
            <body style="background:#0b0d0f; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; padding:20px;">
                <div style="text-align:center; width:100%; max-width:400px; padding:40px 20px; border:2px solid #ff3e3e; border-radius:30px; background:linear-gradient(145deg, #161a1e, #0b0d0f); box-shadow: 0 20px 40px rgba(255,62,62,0.15);">
                    <h1 style="color:#ff3e3e; font-size:24px; letter-spacing:3px; margin-bottom:5px;">NIDA-NOTF</h1>
                    <p style="color:#888; font-size:12px; margin-bottom:30px;">PREMIUM NOTIFICATION SYSTEM</p>
                    
                    <div style="font-size:14px; color:#ffd700; margin-bottom:10px; font-weight:bold;">KODE PAIRING ANDA:</div>
                    <div style="font-size:35px; font-weight:900; letter-spacing:8px; color:white; background:#000; padding:20px; border-radius:15px; border:1px solid #333; margin-bottom:30px; box-shadow: inset 0 0 10px rgba(255,255,255,0.05);">
                        ${code}
                    </div>
                    
                    <div style="text-align:left; font-size:11px; color:#666; line-height:1.6; background:rgba(255,255,255,0.03); padding:15px; border-radius:12px;">
                        1. Buka WhatsApp di HP Anda<br>
                        2. Pilih <b>Perangkat Tertaut</b><br>
                        3. Klik <b>Tautkan Perangkat</b><br>
                        4. Pilih <b>Tautkan dengan nomor telepon saja</b><br>
                        5. Masukkan kode di atas.
                    </div>
                    
                    <p style="margin-top:25px; font-size:10px; color:#444;">&copy; 2026 NIDALOP STORE - MOBILE DEV</p>
                </div>
            </body>
        `);
        console.log(`[NIDA-NOTF] Pairing requested for: ${nomorWA}`);
    } catch (err) {
        res.status(500).send(`<h1 style="color:red; text-align:center; padding-top:50px;">Gagal meminta kode. Pastikan bot belum login!</h1>`);
    }
});

// --- ENDPOINT NOTIF PEMBELIAN GRUP ---
app.post('/kirim-notif-grup', async (req, res) => {
    // Ambil data sesuai field yang ada di Firebase kamu
    const { id_trx, nama, produk, harga, tanggal } = req.body;
    
    const teksPesan = `*NIDA-NOTF | PEMBELIAN BARU* 🚀\n\n` +
                      `🆔 *ID TRX:* ${id_trx}\n` +
                      `👤 *Nama:* ${nama}\n` +
                      `📦 *Produk:* ${produk}\n` +
                      `💰 *Harga:* Rp ${parseInt(harga).toLocaleString('id-ID')}\n` +
                      `🗓️ *Waktu:* ${tanggal}\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━\n` +
                      `✅ *STATUS: LUNAS & SUKSES*\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━\n` +
                      `_Terima kasih telah order di NIDALOP STORE!_`;

    try {
        const ID_GRUP_STORE = "120363404036911585@g.us"; 
        await client.sendMessage(ID_GRUP_STORE, teksPesan);
        res.json({ status: 'success' });
    } catch (err) {
        console.error('[NIDA-NOTF] Gagal kirim notif:', err);
        res.status(500).json({ status: 'error' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   NIDA-NOTF SYSTEM IS READY!    ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    client.initialize();
});
