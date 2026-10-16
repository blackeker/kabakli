const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const DATA_PATH = path.resolve(__dirname, '..', 'data/data.json');

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

    try {
        if (!fs.existsSync(DATA_PATH)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Menü verileri bulunamadı.' }));
            return;
        }
        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const data = JSON.parse(rawData);
        const dates = data.map(d => d.tarih);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dates));
    } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
    }
};