// src/api/backend.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

// Unified processMessage — handles text + image + audio in one call
export const processMessage = async ({ text = "", imageFile = null, audioFile = null, language = "sw" }) => {
  const formData = new FormData()
  
  if (text) formData.append("text", text)
  if (imageFile) formData.append("image", imageFile)
  if (audioFile) formData.append("audio", audioFile)
  formData.append("language", language)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 45000)

  try {
    const response = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data

  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error("Request timeout — picha au sauti ni kubwa sana. Jaribu tena.")
    }
    throw err
  }
}

// NEW: Dedicated voice-only function (cleaner for VoiceRecorder)
export const processVoice = async (audioBlob) => {
  const formData = new FormData()
  formData.append("audio", audioBlob, "voice.webm")
  formData.append("language", "sw-KE")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s for voice

  try {
    const response = await fetch(`${BACKEND_URL}/voice`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) throw new Error("Voice processing failed")

    const data = await response.json()
    return data
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}


// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

// export const processMessage = async ({ text = "", imageFile = null, audioFile = null, language = "sw" }) => {
//   const formData = new FormData()
  
//   if (text) formData.append("text", text)
//   if (imageFile) formData.append("image", imageFile)
//   if (audioFile) formData.append("audio", audioFile)
//   formData.append("language", language)

//   // 45-second timeout + error handling
//   const controller = new AbortController()
//   const timeoutId = setTimeout(() => controller.abort(), 45000)

//   try {
//     const response = await fetch(`${BACKEND_URL}/process`, {
//       method: "POST",
//       body: formData,
//       signal: controller.signal
//     })

//     clearTimeout(timeoutId)

//     if (!response.ok) {
//       const errorText = await response.text()
//       throw new Error(`Server error: ${response.status} - ${errorText}`)
//     }

//     const data = await response.json()
//     return data

//   } catch (err) {
//     clearTimeout(timeoutId)
//     if (err.name === 'AbortError') {
//       throw new Error("Request timeout — picha ni kubwa sana. Jaribu tena na picha ndogo.")
//     }
//     throw err
//   }
// }
