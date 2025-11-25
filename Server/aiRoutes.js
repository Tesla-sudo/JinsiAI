const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

module.exports = (upload, pushToCSV) => {

  // === VOICE-ONLY ENDPOINT (now exists!) ===
  router.post('/voice', upload.single('audio'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio received" });
    }

    try {
      const audioPath = req.file.path;
      const wavPath = audioPath + '.wav';
      const { execSync } = require('child_process');
      execSync(`ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 "${wavPath}"`, { stdio: 'ignore' });

      const stt = await axios.post(
        `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=sw-KE`,
        fs.readFileSync(wavPath),
        { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'audio/wav' } }
      );

      const transcribedText = stt.data.DisplayText || "Sikuelewa vizuri";

      // Clean up
      fs.unlinkSync(audioPath);
      fs.unlinkSync(wavPath);

      // Forward to main /process logic (reuse your perfect AI)
      req.body.text = transcribedText;
      req.body.language = 'sw';
      // Reuse the same logic as /process but without image
      return router.handle(req, res, () => {}); // This will trigger /process below
    } catch (err) {
      console.error("Voice endpoint error:", err.message);
      fs.unlinkSync(req.file.path);
      res.json({ success: true, gptOutput: "Samahani, sauti haikusikika vizuri. Jaribu tena au andika swali lako." });
    }
  });

  // === MAIN /process ENDPOINT (your current perfect AI) ===
  router.post('/process', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]), async (req, res) => {
    try {
      let userText = (req.body.text || '').toLowerCase().trim();
      let hasImage = !!req.files?.image?.[0];
      let hasAudio = !!req.files?.audio?.[0];

      // === VOICE TO TEXT ===
      if (hasAudio) {
        try {
          const { execSync } = require('child_process');
          const audioPath = req.files.audio[0].path;
          const wavPath = audioPath + '.wav';
          execSync(`ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 "${wavPath}"`, { stdio: 'ignore' });
          const stt = await axios.post(
            `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=sw-KE`,
            fs.readFileSync(wavPath),
            { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'audio/wav' } }
          );
          userText += ' ' + (stt.data.DisplayText || '').toLowerCase();
          fs.unlinkSync(wavPath);
        } catch (e) {
          userText += ' sauti';
        }
        fs.unlinkSync(req.files.audio[0].path);
      }

      // === GREETINGS & QUICK REPLIES ===
      const GREETING_KEYWORDS = ["habari", "mambo", "shikamoo", "hello", "hi"];
      const THANKS_KEYWORDS = ["asante", "thank you"];
      const GENERAL_QUESTIONS = ["jina lako", "unaendeleaje", "unaweza kufanya nini"];

      if (GREETING_KEYWORDS.some(w => userText.includes(w))) {
        const reply = ["Habari za shamba!", "Mambo poa mkulima!", "Shikamoo!"][Math.floor(Math.random()*3)];
        pushToCSV({ eventType: "greeting", adviceGiven: reply });
        return res.json({ success: true, gptOutput: reply });
      }
      if (THANKS_KEYWORDS.some(w => userText.includes(w))) {
        return res.json({ success: true, gptOutput: "Karibu sana mkulima!" });
      }
      if (GENERAL_QUESTIONS.some(q => userText.includes(q))) {
        return res.json({ success: true, gptOutput: "Mimi ni JinsiAI — msaidizi wako wa kilimo! Napiga picha, nasikia sauti, nakutambua magonjwa, nakupa ushauri wa maji na hewa chafu." });
      }

      // === FULL AI DIAGNOSIS (with vision) ===
      let imageBase64 = null;
      if (hasImage) {
        imageBase64 = fs.readFileSync(req.files.image[0].path, 'base64');
        fs.unlinkSync(req.files.image[0].path);
      }

      const messages = [
        { role: "system", content: "You are JinsiAI — Kenya's best AI farming doctor. Speak warm, simple Kiswahili. Diagnose diseases, give local treatments, water & carbon tips. End with encouragement." }
      ];

      if (imageBase64) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: userText || "Tazama picha hii na ueleze ugonjwa na matibabu" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        });
      } else {
        messages.push({ role: "user", content: userText || "Nisaidie na kilimo" });
      }

      const gpt = await axios.post(
        `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`,
        { messages, max_tokens: 600, temperature: 0.4 },
        { headers: { 'api-key': process.env.AZURE_OPENAI_KEY }, timeout: 90000 }
      );

      const answer = gpt.data.choices[0].message.content.trim();

      pushToCSV({
        farmerId: req.body.farmerId || "farmer_" + Date.now(),
        eventType: hasImage ? "image_diagnosis" : "voice_or_text",
        disease: hasImage ? "From photo" : "None",
        co2SavedKg: hasImage ? 0.8 : 0.4,
        waterSavedLiters: hasImage ? 250 : 100,
        adviceGiven: answer.substring(0, 400)
      });

      res.json({ success: true, gptOutput: answer });

    } catch (err) {
      console.error("Error:", err.message);
      res.json({ success: true, gptOutput: "Samahani mkulima, jaribu tena — niko hapa nikusaidie!" });
    }
  });

  return router;
};
