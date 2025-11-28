const express = require('express')
const router = express.Router()
const fs = require('fs')
const axios = require('axios')
const ffmpegPath = require('ffmpeg-static')
const { execFile } = require('child_process')
const util = require('util')
const execFileAsync = util.promisify(execFile)

module.exports = (upload, pushToCSV) => {

  router.post('/voice', upload.single('audio'), async (req, res) => {
    // voice code unchanged — perfect
    if (!req.file) return res.status(400).json({ error: "No audio" })
    const inputPath = req.file.path
    const wavPath = inputPath + '.wav'
    try {
      await execFileAsync(ffmpegPath, ['-y', '-i', inputPath, '-ar', '16000', '-ac', '1', '-f', 's16le', '-acodec', 'pcm_s16le', wavPath])
      const stt = await axios.post(`${process.env.AZURE_SPEECH_ENDPOINT}/speech/recognition/conversation/cognitiveservices/v1?language=sw-KE`, fs.createReadStream(wavPath), {
        headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY.trim(), 'Content-Type': 'audio/L16; rate=16000' }
      })
      const text = (stt.data.DisplayText || "").trim()
      fs.unlinkSync(inputPath); fs.unlinkSync(wavPath)
      if (!text) return res.json({ success: true, gptOutput: "Samahani mkulima, sikukusikia vizuri. Jaribu tena karibu na simu." })
      req.body.text = text
      return router.handle(req, res)
    } catch (e) {
      try { fs.unlinkSync(inputPath); fs.unlinkSync(wavPath) } catch {}
      return res.json({ success: true, gptOutput: "Jaribu tena mkulima." })
    }
  })

  router.post('/process', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]), async (req, res) => {
    try {
      let userText = (req.body.text || '').toString().trim()
      const imageFile = req.files?.image?.[0]
      let imageBase64 = null
      let detectedDisease = "Hakuna ugonjwa uliogunduliwa"

      if (imageFile) {
        imageBase64 = fs.readFileSync(imageFile.path, 'base64')
        fs.unlinkSync(imageFile.path)
      }

      const systemPrompt = `You are JinsiAI — daktari bora wa mazao Kenya.

Jibu kwa Kiswahili rahisi na mpangilio huu haswa:

UGONJWA: Jina la ugonjwa au Hakuna

Hali ya Mazao:
• Dalili 1
• Dalili 2

Matibabu ya Haraka:
1. Hatua 1
2. Hatua 2
3. Hatua 3

Kinga ya Baadaye:
• Ushauri 1
• Ushauri 2

Tumia emoji za kijani na nyekundu. Usiandike chochote zaidi ya hii muundo.`

      const messages = [{ role: "system", content: systemPrompt }]

      if (imageBase64) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: userText || "Tazama picha hii vizuri na jibu kwa muundo ulioombwa." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        })
      } else {
        messages.push({ role: "user", content: userText || "Nisaidie na kilimo leo." })
      }

      const gptRes = await axios.post(
        `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`,
        { messages, max_tokens: 900, temperature: 0.3 },
        { headers: { 'api-key': process.env.AZURE_OPENAI_KEY }, timeout: 90000 }
      )

      let answer = gptRes.data.choices[0]?.message?.content?.trim() || "Samahani, jaribu tena."

      // Extract disease name
      const diseaseMatch = answer.match(/UGONJWA:\s*([^\n\r]+)/i)
      if (diseaseMatch?.[1]) {
        detectedDisease = diseaseMatch[1].trim()

        // Replace with clean, beautiful Markdown (no raw HTML)
        answer = answer.replace(
          /UGONJWA:[^\n\r]+/i,
          `**UGONJWA: ${detectedDisease}**`
        )
      }

      // Final clean & beautiful formatting
      answer = answer
        .replace(/^Hali ya Mazao:/gim, '**Hali ya Mazao:**')
        .replace(/^Matibabu ya Haraka:/gim, '**Matibabu ya Haraka:**')
        .replace(/^Kinga ya Baadaye:/gim, '**Kinga ya Baadaye:**')

      // Save clean text to CSV (no HTML, no **)
      pushToCSV({
        eventType: imageFile ? "image_diagnosis" : "text_voice_query",
        disease: detectedDisease,
        adviceGiven: answer.replace(/\*\*/g, '').substring(0, 500),
        co2SavedKg: imageFile ? 0.8 : 0.4,
        waterSavedLiters: imageFile ? 250 : 100
      })

      res.json({ success: true, gptOutput: answer })

    } catch (err) {
      console.error("ERROR:", err.message)
      pushToCSV({ eventType: "error", disease: "Hitilafu", adviceGiven: "Failed" })
      res.json({ success: true, gptOutput: "Samahani mkulima, picha haikuonekana vizuri. Tuma tena." })
    }
  })

  return router
}
