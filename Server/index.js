const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const { pushToCSV } = require('./dataPush');
const aiRoutes = require('./aiRoutes');
require('dotenv').config();

const app = express();

// ALLOW BIG FILES (100MB) + LONG TIMEOUT (5 minutes)
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '100mb', extended: true }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// Multer: Accept up to 100MB files
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/', 'video/', 'audio/'];
    if (allowed.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Increase server timeout to 5 minutes (for large files + slow networks)
app.use((req, res, next) => {
  req.setTimeout(5 * 60 * 1000); // 5 minutes
  res.setTimeout(5 * 60 * 1000);
  next();
});

// Your routes
app.use('/', aiRoutes(upload, pushToCSV));

// Token endpoint (if you ever want WebChat later)
app.post('/api/token', async (req, res) => {
  try {
    const secret = process.env.DIRECT_LINE_SECRET;
    if (!secret) return res.status(500).json({ error: "No Direct Line secret" });
    const response = await axios.post(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      {},
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    res.json({ token: response.data.token });
  } catch (err) {
    res.status(500).json({ error: "Invalid secret" });
  }
});

app.get('/', (req, res) => res.send('JinsiAI Server — BIG FILES NOW WORK!'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`JINSIAI SERVER RUNNING → http://localhost:${PORT}`);
  console.log("100MB file limit + 5-minute timeout — Farmers can send ANY photo/video!");
});
