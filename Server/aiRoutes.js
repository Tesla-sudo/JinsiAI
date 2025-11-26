const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const { execSync } = require('child_process');
require('dotenv').config();

module.exports = (upload, pushToCSV) => {

  // ========= /voice endpoint (voice-only) =========
  router.post('/voice', upload.single('audio'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file received" });
    }

    try {
      const audioPath = req.file.path;
      const wavPath = audioPath + '.wav';
      execSync(`ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 "${wavPath}"`, { stdio: 'ignore' });

      const sttRes = await axios.post(
        `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=sw-KE`,
        fs.readFileSync(wavPath),
        { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'audio/wav' } }
      );

      const transcribed = (sttRes.data.DisplayText || "Sauti imepokelewa").trim();
      fs.unlinkSync(wavPath);
      fs.unlinkSync(audioPath);

      // Forward to main /process logic with transcribed text
      req.body.text = transcribed;
      return router.handle(req, res); // calls /process below
    } catch (err) {
      console.error("Voice processing error:", err.message);
      fs.unlinkSync(req.file.path);
      return res.json({ success: true, gptOutput: "Samahani, sauti haikusikika vizuri. Jaribu tena." });
    }
  });

  // ========= MAIN /process endpoint (photo + voice + text) =========
  router.post('/process', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]), async (req, res) => {
    try {
      let userText = (req.body.text || '').toLowerCase().trim();
      const hasImage = !!req.files?.image?.[0];
      const conversationId = req.body.conversationId || req.headers['conversationid'] || "";

      // === Handle voice (if sent directly or via /process) ===
      if (req.files?.audio?.[0]) {
        const audioPath = req.files.audio[0].path;
        const wavPath = audioPath + '.wav';
        execSync(`ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 "${wavPath}"`, { stdio: 'ignore' });
        const sttRes = await axios.post(
          `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=sw-KE`,
          fs.readFileSync(wavPath),
          { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'audio/wav' } }
        );
        userText += ' ' + (sttRes.data.DisplayText || '').toLowerCase().trim();
        fs.unlinkSync(wavPath);
        fs.unlinkSync(audioPath);
      }

      // === Quick greetings & thanks ===
      if (/habari|mambo|shikamoo|hello|hi|jambo/.test(userText)) {
        const replies = ["Habari za shamba mkulima!", "Mambo poa!", "Shikamoo mzee!", "Karibu JinsiAI!"];
        return res.json({ success: true, gptOutput: replies[Math.floor(Math.random() * replies.length)] });
      }
      if (/asante|thanks|thank you|a hsante/.test(userText)) {
        return res.json({ success: true, gptOutput: "Karibu sana mkulima! Endelea kulima kwa bidii." });
      }

      // === Image handling + GPT-4 Vision ===
      let imageBase64 = null;
      if (hasImage) {
        imageBase64 = fs.readFileSync(req.files.image[0].path, 'base64');
        fs.unlinkSync(req.files.image[0].path);
      }

      const messages = [
        { role: "system", content: "You are JinsiAI — Kenya's best AI farming doctor. Speak warm, simple Kiswahili. Diagnose diseases, give local treatments, water-saving & carbon-reducing tips." }
      ];

      if (imageBase64) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: userText || "Tazama picha hii na ueleza ugonjwa, matibabu na ushauri wa kilimo bora." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        });
      } else {
        messages.push({ role: "user", content: userText || "Nisaidie na kilimo leo." });
      }

      const gptRes = await axios.post(
        `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`,
        { messages, max_tokens: 600, temperature: 0.4 },
        { headers: { 'api-key': process.env.AZURE_OPENAI_KEY }, timeout: 90000 }
      );

      const answer = gptRes.data.choices[0].message.content.trim();

      // === Save to CSV with conversationId for daily notifications ===
      pushToCSV({
        farmerId: req.body.farmerId || "anon",
        eventType: hasImage ? "image_diagnosis" : "voice_text",
        disease: hasImage ? "Detected from photo" : "None",
        co2SavedKg: hasImage ? 0.8 : 0.4,
        waterSavedLiters: hasImage ? 250 : 100,
        location: req.body.location || "Kenya",
        adviceGiven: answer.substring(0, 500),
        conversationId
      });

      res.json({ success: true, gptOutput: answer });

    } catch (err) {
      console.error("Process error:", err.message);
      res.json({ success: true, gptOutput: "Samahani mkulima, nimekosa kidogo. Jaribu tena — niko hapa nikusaidie!" });
    }
  });

  return router;
};
