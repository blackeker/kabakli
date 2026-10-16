const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const DATA_PATH = path.resolve(__dirname, '..', 'data/data.json');

// Helper to remove diacritics for better matching
function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Bot'un menuData.js'deki emoji mantığını buraya taşıyalım
function getItemEmoji(item) {
    if (!item) return '🍽️';
    const t = removeDiacritics(item.toLowerCase());
    if (t.includes('corba')) return '🥣';
    if (t.includes('kek') || t.includes('tatli') || t.includes('helva') || t.includes('cikolata')) return '🍰';
    if (t.includes('recel') || t.includes('bal') || t.includes('tahin')) return '🍯';
    if (t.includes('cay') || t.includes('kahve')) return '☕';
    if (t.includes('su')) return '💧';
    if (t.includes('ayran') || t.includes('sut') || t.includes('meyve suyu') || t.includes('icecek')) return '🥤';
    if (t.includes('patates') || t.includes('kizartma')) return '🥔';
    if (t.includes('makarna') || t.includes('eriste')) return '🍝';
    if (t.includes('pilav') || t.includes('pirinc') || t.includes('bulgur')) return '🍚';
    if (t.includes('tavuk')) return '🍗';
    if (t.includes('kofte') || t.includes('kebab') || t.includes('et') || t.includes('doner')) return '🥩';
    if (t.includes('manti') || t.includes('nohut') || t.includes('fasulye')) return '🍲';
    if (t.includes('simit') || t.includes('pogaca') || t.includes('borek')) return '🥐';
    if (t.includes('pizza')) return '🍕';
    if (t.includes('ekmek')) return '🥖';
    if (t.includes('omlet') || t.includes('yumurta')) return '🍳';
    if (t.includes('peynir') || t.includes('kasar')) return '🧀';
    if (t.includes('zeytin')) return '🫒';
    if (t.includes('salata') || t.includes('cacik')) return '🥗';
    if (t.includes('yogurt')) return '🥣';
    if (t.includes('meyve')) return '🍎';
    return '🍽️';
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    const { query } = parse(req.url, true);
    const dateQuery = query.date; // Format: DD.MM.YYYY

    try {
        if (!fs.existsSync(DATA_PATH)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Menü verileri bulunamadı.' }));
            return;
        }
        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const data = JSON.parse(rawData);

        if (!dateQuery) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data)); // Tüm veriyi gönder
            return;
        }

        const menu = data.find(d => d.tarih === dateQuery);
        if (!menu) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Belirtilen tarih için menü bulunamadı.' }));
            return;
        }

        // Emojileri ekleyerek gönderelim
        const formattedMenu = {
            ...menu,
            kahvalti: (menu.kahvalti || []).map(item => ({ text: item, emoji: getItemEmoji(item) })),
            aksam_yemegi: (menu.aksam_yemegi || []).map(item => ({ text: item, emoji: getItemEmoji(item) }))
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(formattedMenu));
    } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Sunucu hatası: ' + err.message }));
    }
};