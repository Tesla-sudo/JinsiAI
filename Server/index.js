const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { pushToCSV } = require('./dataPush');
const aiRoutes = require('./aiRoutes');
// const cors = require('cors');

const app = express();

// CORS — allows localhost + future live URL
app.use(cors({
  origin: ["http://localhost:5173", "https://your-deployed-frontend-url.azurestaticapps.net"]
}));
app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173',
// }));
// ===== ADD THIS LINE =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    }
  }
}));
// =========================
// File upload folders
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, 'uploads/images');
    else if (file.mimetype.startsWith('audio')) cb(null, 'uploads/audio');
    else cb(null, 'uploads/others');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Mount AI routes
app.use('/', aiRoutes(upload, pushToCSV));
app.use('/api/ai', aiRoutes(upload, pushToCSV));

// Optional: Serve CSV
app.get('/data/farmer_data.csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'farmer_data.csv'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled`);
  console.log(`POST /process → READY`);
  console.log(`CSV saved at: ${path.join(__dirname, 'server', 'farmer_data.csv')}`);
});
