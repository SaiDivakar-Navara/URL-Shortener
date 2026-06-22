const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:3000`;

// DB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
});
pool.getConnection()
  .then(() => console.log('✅ MySQL connected'))
  .catch(err => console.error('❌ DB connection failed:', err.message));

function generateCode() {
  return crypto.randomBytes(4).toString('hex'); // 8-char code
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


//  short URL Endpoint
app.post('/api/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'URL required' });

    const code = generateCode();
    await pool.query('INSERT INTO urls (long_url, short_code) VALUES (?, ?)', [longUrl, code]);
    res.json({ shortUrl: `${BASE_URL}/${code}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect short URL
app.get('/:code', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT long_url FROM urls WHERE short_code = ?', [req.params.code]);
    if (rows.length === 0) return res.status(404).send('Not found');
    res.redirect(rows[0].long_url);
  } catch {
    res.status(500).send('Server error');
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Running at ${BASE_URL}`));

