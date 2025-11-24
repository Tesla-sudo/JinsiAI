import { useState } from 'react'
import { FiCamera } from "react-icons/fi"
import { processMessage } from '../api/backend'

export default function PhotoUploader({ onResult }) {
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const result = await processMessage({ imageFile: file, language: "sw" })
      
      onResult({
        success: true,
        gptOutput: result.gptOutput,
        visionResult: result.visionResult,
        transcribedSpeech: result.transcribedSpeech?.text || ""
      })
    } catch {
      onResult({ success: false, error: "AI haikuweza kuchanganua picha" })
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        disabled={loading}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <label className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-xl transition-all cursor-pointer font-medium ${
        loading 
          ? "bg-gray-400 text-white" 
          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105"
      }`}>
        <FiCamera className="text-2xl" />
        {loading ? "Inachanganuliwa..." : "Piga Picha"}
      </label>
    </div>
  )
}
