const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { pushToCSV } = require('./dataPush');
const aiRoutes = require('./aiRoutes');   // ← This file has your /process, /chat, /voice
require('dotenv').config();

const app = express();

// === MUST BE IN THIS ORDER ===
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// Multer for big files
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

// THIS LINE WAS MISSING OR WRONG → THIS FIXES THE 404
app.use('/', aiRoutes(upload, pushToCSV));

// Health check
app.get('/', (req, res) => {
  res.send(`
    <h1>JinsiAI Server Running!</h1>
    <p>All endpoints ready:</p>
    <ul>
      <li>POST /process → photo + voice + text</li>
      <li>POST /chat    → text only</li>
      <li>POST /voice   → voice only (coming soon)</li>
      <li>GET  /data/farmer_data.csv → Power BI</li>
    </ul>
  `);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\nJINSIAI SERVER IS ALIVE → http://localhost:${PORT}`);
  console.log(`All routes mounted: /process, /chat, /voice → 200 OK`);
});
