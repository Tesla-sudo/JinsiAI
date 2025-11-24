const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const axios = require('axios');
require('dotenv').config(); 
const ffmpeg = require('fluent-ffmpeg');

module.exports = (upload) => {


  const AZURE_REGION = process.env.AZURE_REGION;


  const callGPT4 = async (text) => {
    const response = await axios.post(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2025-01-01-preview`,
      {
        messages: [
          {
            role: "user",
            content: text   // <-- Azure expects plain string here
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_KEY
        }
      }
    );
  
    const message = response.data.choices[0].message;
  
    console.log("AZURE RAW:", message);
  
    return message.content;  // <-- correct final text
  };
  
  
  
  
  const analyzeImageFullJSON = async (imagePath) => {
    const imageData = fs.readFileSync(imagePath);
    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories,Description,Tags,Objects,Color,Adult,Faces`,
      imageData,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_REGION,
          "Content-Type": "application/octet-stream"
        }
      }
    );
    return response.data; 
  };
  
  
  const translateText = async (text, fromLang, toLang) => {
    if (fromLang === toLang) return text;
  
    const response = await axios.post(
      `${process.env.AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=${fromLang}&to=${toLang}`,
      [{ text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_TRANSLATOR_REGION,  // REQUIRED!
          "Content-Type": "application/json"
        }
      }
    );
  
    return response.data[0].translations[0].text;
  };
  
  
  

  const analyzeImage = async (imagePath) => {
    const imageData = fs.readFileSync(imagePath);

    const response = await axios.post(
      `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description,Tags`,
      imageData,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
          "Ocp-Apim-Subscription-Region": AZURE_REGION,
          "Content-Type": "application/octet-stream"
        }
      }
    );

    return response.data.description?.captions?.[0]?.text || "No description detected";
  };


  const speechToText = async (audioPath, language = "en-US") => {
    // Convert to WAV 16kHz mono
    const wavPath = audioPath.replace(path.extname(audioPath), '.wav');
  
    await new Promise((resolve, reject) => {
      ffmpeg(audioPath)
        .outputOptions([
          '-ar 16000', // 16 kHz
          '-ac 1',     // mono
          '-f wav'
        ])
        .save(wavPath)
        .on('end', resolve)
        .on('error', reject);
    });
  
    const audioData = fs.readFileSync(wavPath);
  
    const response = await axios.post(
      `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&format=detailed`,
      audioData,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
          "Ocp-Apim-Subscription-Region": AZURE_REGION,
          "Content-Type": "audio/wav" // ✅ correct type
        }
      }
    );
  
    // Clean up temp WAV
    fs.unlinkSync(wavPath);
  
    return {
      text: response.data.DisplayText || "",
      fullJson: response.data
    };
  };

  const textToSpeech = async (text, language = "en-US", voice = "en-US-JennyNeural") => {
    try {
      const ttsResponse = await axios.post(
        `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        `<speak version='1.0' xml:lang='${language}'><voice name='${voice}'>${text}</voice></speak>`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
          },
          responseType: "arraybuffer",
        }
      );
  
      // ✅ Log size to verify non-empty response
      console.log("TTS Audio Buffer Size:", ttsResponse.data.byteLength, "bytes");
  
      if (ttsResponse.data.byteLength === 0) {
        throw new Error("Empty TTS response");
      }
  
      const ttsPath = `uploads/audio/response-${Date.now()}.mp3`;
      await fs.promises.writeFile(ttsPath, Buffer.from(ttsResponse.data));
      return ttsPath;
    } catch (err) {
      console.error("TTS Error:", err.message);
      throw err;
    }
  };
  


  router.post('/process',
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 }
    ]),
    async (req, res) => {
      try {
        const textInput = req.body.text || '';
        const language = req.body.language || 'en';
  
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const audioFile = req.files['audio'] ? req.files['audio'][0] : null;
  
        // 1. Speech → Text
        let speechText = '';
        if (audioFile) speechText = await speechToText(audioFile.path, language);
  
        // 2. Translate ALL input to English
        let combinedText = `${textInput} ${speechText}`;
        const englishText = language !== 'en'
          ? await translateText(combinedText, language, 'en')
          : combinedText;
  
        // 3. Image analysis
        let visionResult = null;
        if (imageFile) {
          // get full CV JSON, not just caption
          visionResult = await analyzeImageFullJSON(imageFile.path);
        }
  
        // 4. GPT prompt — send **full vision JSON** for reasoning
        const gptPrompt = `
  User input: ${englishText}
  
  Here is the full analysis of the uploaded image:
  ${JSON.stringify(visionResult, null, 2)}
  
  Based on this, provide:
  - Detailed plant disease/pest analysis (if applicable)
  - Likely causes
  - Severity
  - Suggested treatment and prevention
  - Ask follow-up questions if needed for more clarity
        `;
  
        let gptOutput = await callGPT4(gptPrompt);
  
        // 5. Translate GPT output back to user's language
        if (language !== 'en') {
          gptOutput = await translateText(gptOutput, 'en', language);
        }
  
        res.json({
          success: true,
          gptOutput,
          visionResult,
          transcribedSpeech: speechText
        });
  
        if (imageFile) fs.unlinkSync(imageFile.path);
        if (audioFile) fs.unlinkSync(audioFile.path);
  
    } catch (error) {
        console.error("🔥 AZURE ERROR RAW:", error.response?.data || error.message);
        return res.status(500).json({
          success: false,
          azureError: error.response?.data || null,
          message: error.message
        });
      }
    }
  );
  
  


  router.post('/chat', async (req, res) => {
    try {
      const { text, language = 'en' } = req.body;
      if (!text) return res.status(400).json({ success: false, message: "Text required" });
      console.log(process.env.AZURE_TRANSLATOR_REGION);

      const englishText = language !== 'en'
        ? await translateText(text, language, 'en')
        : text;

      let gptResponse = await callGPT4(englishText);

      if (language !== 'en') {
        gptResponse = await translateText(gptResponse, 'en', language);
      }

      res.json({ success: true, response: gptResponse });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Chat error", error: error.message });
    }
  });


  router.post('/voice', upload.single('audio'), async (req, res) => {
    try {
      const audioFile = req.file;
      const language = req.body.language || 'en-US';
  
      if (!audioFile)
        return res.status(400).json({ success: false, message: "Audio file required" });
  
      // 1. STT (MP3 → WAV → Azure)
      const { text: speechText } = await speechToText(audioFile.path, language);
  
      if (!speechText) {
        fs.unlinkSync(audioFile.path);
        return res.status(400).json({
          success: false,
          message: "Could not transcribe audio"
        });
      }
  
      // 2. Translate to English if needed
      const englishText = language.startsWith('en')
        ? speechText
        : await translateText(speechText, language, 'en');
  
      // 3. GPT response
      let gptResponse = await callGPT4(englishText);
  
      // 4. Translate back if needed
      let finalText = language.startsWith('en')
        ? gptResponse
        : await translateText(gptResponse, 'en', language);
  
      // 5. TTS (real audio)
      const ttsPath = await textToSpeech(finalText, language);
  
      res.json({
        success: true,
        textResponse: finalText,
        audioFile: ttsPath
      });
  
      // Cleanup uploaded audio
      fs.unlinkSync(audioFile.path);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Voice chat error", error: error.message });
    }
  });
  
  

  return router;
};
