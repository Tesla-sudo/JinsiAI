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

## Frontend Project Structure

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

```bash
cd Frontend
npm install
npm run dev
