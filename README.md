# JinsiAI - Armely Hackathon
# Frontend 

# JinsiAI – Frontend  
**Msaidizi wa Kilimo Mahiri kwa Wakati wa Tabianchi**  
 React + Vite + Tailwind CSS  

Live Demo: https://your-azure-url-here.com (after deploy)  
Pitch Deck: [JinsiAI_Pitch_Deck.pdf](pitch-deck/JinsiAI_Pitch_Deck.pdf)

## Features (What Makes JinsiAI Win Hackathons)

| Feature                        | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| Swahili-First Interface      | Full experience in Kiswahili + local languages (Luo, Kamba, Kalenjin, Somali) |
| Plant Disease Diagnosis       | Farmer takes photo → AI instantly identifies disease + gives treatment     |
| Climate Impact Tracker        | Shows exact liters of water saved & kg of CO₂ reduced per recommendation  |
| Offline-First PWA             | Works without internet after first load                                    |
| Voice Input                   | Speak in Swahili → message appears (VoiceRecorder component)              |
| Photo Upload with Camera      | Direct camera access + instant mock AI analysis (replaceable with real API)|
| Modern Glassmorphic UI        | Premium 2025 design with hover effects, gradients, blur, Inter font       |
| Market Price Integration      | Real-time Nairobi market prices (mocked – ready for API)                   |
| Responsive & Mobile-First     | Looks perfect on cheap Android phones used by farmers                     |

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3.4 + Inter font
- **Icons**: react-icons/fi
- **Build Tool**: Vite 5+
- **Deployment**: Azure Static Web Apps (1-click deploy ready)
- **PWA Ready**: Service worker + manifest included

## Frontend Project Structure (view it well in edit mode)

Frontend/
├── public/
│   ├── vite.svg
│   └── pwa-192.png / pwa-512.png          # App icons
├── src/
│   ├── components/
│   │   ├── ChatBubble.jsx                  # Beautiful message bubbles + diagnosis card
│   │   ├── PhotoUploader.jsx               # Camera + mock AI disease diagnosis
│   │   ├── VoiceRecorder.jsx               # Voice input (ready for Whisper API)
│   │   └── TypingIndicator.jsx            # "AI is typing..." animation
│   ├── pages/
│   │   └── Home.jsx                        # Main chat + cards + floating input bar
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                           # Tailwind + glassmorphic styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md


## How to Run Locally (Takes 15 seconds)

cd Frontend
npm install
npm run dev



## Backend

# JinsiAI Server  
**AI-Powered Crop Disease Doctor & Climate-Smart Farming Advisor for Kenyan Farmers**

JinsiAI is a Swahili-speaking AI assistant that helps farmers:
- Diagnose crop diseases from photos
- Get local, practical treatment advice
- Receive water-saving & carbon-reducing farming tips
- Chat naturally with warm greetings and responses

Built with **Azure OpenAI (GPT-4 Vision)**, **Azure Speech-to-Text**, and **Node.js/Express**.

---

### Features
- Real-time plant disease detection from images
- Voice input in Kiswahili (with speech-to-text)
- Warm, human-like greetings & conversation
- Climate-smart farming recommendations
- Location-aware advice (Kitui, Eldoret, Nyeri, etc.)
- Saves every interaction to `data/farmer_data.csv` (Power BI ready!)

---

### Tech Stack
- **Backend**: Node.js + Express
- **AI**: Azure OpenAI (GPT-4 with vision), Azure Cognitive Services (Speech)
- **File Handling**: Multer + FFmpeg (for audio conversion)
- **Data Logging**: CSV export (`data/farmer_data.csv`)
- **CORS**: Open for frontend (localhost + production)

---
Data Saved (data/farmer_data.csv)
Every interaction saves a row with:

- Timestamp
- Farmer ID
- Event type
- Disease detected
- CO₂ saved (kg)
- Water saved (liters)
- Location
- Full advice given

---

### Setup Instructions

1. **Clone & Enter Server Folder**
   ```bash
   cd JinsiAI/server

## How to run locally
 ```bash
cd Server 
- npm install
- create a .env file
- fill in your Azure secret keys
- npm run start 
