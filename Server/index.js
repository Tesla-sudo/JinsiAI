// server/index.js  ← FINAL VERSION (WORKS 100%)
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// === CORS: Allow frontend ===
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

app.use(express.json());

// === CREATE FOLDERS IF NOT EXIST ===
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created folder: ${dir}`);
  }
};

ensureDir(path.join(__dirname, 'uploads'));
ensureDir(path.join(__dirname, 'uploads/images'));
ensureDir(path.join(__dirname, 'uploads/audio'));
ensureDir(path.join(__dirname, 'data'));

// === SERVE UPLOADS (for audio playback) ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === SERVE CSV FOR ADMIN DASHBOARD ===
app.use('/data', express.static(path.join(__dirname, 'data')));

// Create CSV with headers if missing
const csvPath = path.join(__dirname, 'data', 'farmer_data.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 
    'Timestamp,FarmerID,EventType,Disease,CO2_Saved_Kg,Water_Saved_Liters,Location,Income_Impact_KSH,Crop_Type,Advice_Given\n'
  );
  console.log("Created farmer_data.csv");
}

// === MULTER: Handle image + audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images');
    } else if (file.mimetype.startsWith('audio/')) {
      cb(null, 'uploads/audio');
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// === IMPORT YOUR DATA PUSH & ROUTES ===
const { pushToAnalytics } = require('./dataPush');  // ← Use the new one
const aiRoutes = require('./aiRoutes');

// === MOUNT ROUTES CORRECTLY ===
app.use('/api/ai', aiRoutes(upload, pushToAnalytics));

// === ROOT ROUTE (for testing) ===
app.get('/', (req, res) => {
  res.json({ 
    message: "JinsiAI Backend is ALIVE!", 
    voice: "POST /api/ai/voice",
    image: "POST /api/ai/process",
    csv: "GET /data/farmer_data.csv"
  });
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nJINSIAI SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Voice AI → http://localhost:${PORT}/api/ai/voice`);
  console.log(`CSV Live → http://localhost:${PORT}/data/farmer_data.csv`);
  console.log(`Uploads → http://localhost:${PORT}/uploads/...`);
  console.log(`\nTOMORROW YOU WIN.\n`);
});



// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const { pushToCSV } = require('./dataPush');
// const aiRoutes = require('./aiRoutes');
// // const cors = require('cors');

// const app = express();

// // CORS — allows localhost + future live URL
// app.use(cors({
//   origin: ["http://localhost:5173", "https://your-deployed-frontend-url.azurestaticapps.net"]
// }));
// app.use(express.json());
// // app.use(cors({
// //   origin: 'http://localhost:5173',
// // }));
// // ===== ADD THIS LINE =====
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.mp3')) {
//       res.setHeader('Content-Type', 'audio/mpeg');
//     }
//   }
// }));
// // =========================
// // File upload folders
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) cb(null, 'uploads/images');
//     else if (file.mimetype.startsWith('audio')) cb(null, 'uploads/audio');
//     else cb(null, 'uploads/others');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// // Mount AI routes
// app.use('/', aiRoutes(upload, pushToCSV));
// app.use('/api/ai', aiRoutes(upload, pushToCSV));

// // Optional: Serve CSV
// app.get('/data/farmer_data.csv', (req, res) => {
//   res.sendFile(path.join(__dirname, 'server', 'farmer_data.csv'));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`CORS enabled`);
//   console.log(`POST /process → READY`);
//   console.log(`CSV saved at: ${path.join(__dirname, 'server', 'farmer_data.csv')}`);
// });
