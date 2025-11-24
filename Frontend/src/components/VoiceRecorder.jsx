import { useState } from 'react'
import { FiMic, FiMicOff } from "react-icons/fi"

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)

  const handleClick = () => {
    setIsRecording(prev => !prev)
    // Optional: add real recording later
    if (!isRecording) {
      setTimeout(() => {
        alert("Voice recording will be added in final version! For now, just type or take photo")
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-full shadow-xl transition-all ${
        isRecording 
          ? "bg-red-500 animate-pulse" 
          : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-110"
      } text-white`}
    >
      {isRecording ? <FiMicOff className="text-2xl" /> : <FiMic className="text-2xl" />}
    </button>
  )
}
