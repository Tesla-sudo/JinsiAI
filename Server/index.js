const express = require('express');
const multer = require('multer');
const path = require('path');
const aiRoutes = require('./aiRoutes');

const app = express();
app.use(express.json());

// File upload folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.mimetype.startsWith('image')) cb(null, 'uploads/images');
    else if(file.mimetype.startsWith('audio')) cb(null, 'uploads/audio');
    else cb(null, 'uploads/others');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// AI routes
app.use('/api/ai', aiRoutes(upload));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
