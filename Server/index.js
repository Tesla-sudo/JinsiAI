const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const aiRoutes = require('./aiRoutes');

const app = express();

// CORS — allows frontend on port 5173
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// File upload folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image')) cb(null, 'uploads/images');
    else if (file.mimetype.startsWith('audio')) cb(null, 'uploads/audio');
    else cb(null, 'uploads/others');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// CRITICAL FIX: Mount routes at root so /process works
app.use('/', aiRoutes(upload));           // ← THIS LINE ADDED
app.use('/api/ai', aiRoutes(upload));     // ← Keep old one too

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for http://localhost:5173`);
  console.log(`POST /process → ready for AI magic`);
});