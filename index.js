const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:3000`;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB connection failed:', err.message));

// URL Schema
const urlSchema = new mongoose.Schema({
  long_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

function generateCode() {
  return crypto.randomBytes(4).toString('hex'); // 8-char code
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Shorten URL Endpoint
app.post('/api/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'URL required' });

    const code = generateCode();
    const newUrl = new Url({ long_url: longUrl, short_code: code });
    await newUrl.save();

    res.json({ shortUrl: `${BASE_URL}/${code}` });
  } catch (err) {
    console.error('Shorten error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Redirect short URL
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ short_code: req.params.code });
    if (!url) return res.status(404).send('Not found');
    res.redirect(url.long_url);
  } catch (err) {
    console.error('Redirect error:', err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Running at ${BASE_URL}`));
