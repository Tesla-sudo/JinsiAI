import { useState } from 'react'
import { FiMic, FiMicOff } from 'react-icons/fi'

export default function VoiceRecorder({ onTranscription }) {
  const [recording, setRecording] = useState(false)

  const toggle = () => {
    setRecording(!recording)
    if (!recording) {
      setTimeout(() => {
        onTranscription("Mahindi yangu yana madoa mekundu")
        setRecording(false)
      }, 4000)
    }
  }

  return (
    <button
      onClick={toggle}
      className={`p-4 rounded-full transition ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200'}`}
    >
      {recording ? <FiMicOff size={24} /> : <FiMic size={24} />}
    </button>
  )
}