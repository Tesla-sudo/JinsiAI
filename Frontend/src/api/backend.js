const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const processMessage = async ({ text = "", imageFile = null, audioFile = null, language = "sw" }) => {
  const formData = new FormData()
  
  if (text) formData.append("text", text)
  if (imageFile) formData.append("image", imageFile)
  if (audioFile) formData.append("audio", audioFile)
  formData.append("language", language)

  // 45-second timeout + error handling
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
      throw new Error("Request timeout — picha ni kubwa sana. Jaribu tena na picha ndogo.")
    }
    throw err
  }
}
