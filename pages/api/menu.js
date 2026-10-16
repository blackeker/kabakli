import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'data.json');

// Helper to remove diacritics for better matching
function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Function to get emoji based on item text
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

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { query } = req;
    const dateQuery = query.date; // Format: DD.MM.YYYY

    try {
        if (!(await fs.access(DATA_PATH).then(() => true).catch(() => false))) {
            res.status(404).json({ error: 'Menu data not found.' });
            return;
        }
        const rawData = await fs.readFile(DATA_PATH, 'utf-8');
        const data = JSON.parse(rawData);

        if (!dateQuery) {
            res.status(200).json(data); // Return all data
            return;
        }

        const menu = data.find(d => d.tarih === dateQuery);
        if (!menu) {
            res.status(404).json({ error: 'Menu not found for the specified date.' });
            return;
        }

        // Add emojis
        const formattedMenu = {
            ...menu,
            kahvalti: (menu.kahvalti || []).map(item => ({ text: item, emoji: getItemEmoji(item) })),
            aksam_yemegi: (menu.aksam_yemegi || []).map(item => ({ text: item, emoji: getItemEmoji(item) }))
        };

        res.status(200).json(formattedMenu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}