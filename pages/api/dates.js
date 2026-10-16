import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'data.json');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (!(await fs.access(DATA_PATH).then(() => true).catch(() => false))) {
            res.status(404).json({ error: 'Menu data not found.' });
            return;
        }
        const rawData = await fs.readFile(DATA_PATH, 'utf-8');
        const data = JSON.parse(rawData);
        const dates = data.map(d => d.tarih);

        res.status(200).json(dates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}