const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { pushToCSV } = require('./dataPush.js');
const aiRoutes = require('./aiRoutes.js');
require('dotenv').config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

// THIS IS THE MOST IMPORTANT LINE
app.use('/', aiRoutes(upload, pushToCSV));

app.get('/', (req, res) => res.send('JinsiAI Server Running – /process ready!'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\nJINSIAI SERVER RUNNING → http://localhost:${PORT}`);
  console.log(`POST /process → 200 OK`);
});
