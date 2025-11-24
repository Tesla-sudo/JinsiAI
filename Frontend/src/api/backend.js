const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const processMessage = async ({ text = "", imageFile = null, audioFile = null, language = "sw" }) => {
  const formData = new FormData()
  
  if (text) formData.append("text", text)
  if (imageFile) formData.append("image", imageFile)
  if (audioFile) formData.append("audio", audioFile)
  formData.append("language", language)  // sw = Swahili

  const response = await fetch(`${BACKEND_URL}/process`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) throw new Error("Backend error")
  return await response.json()
}
