import { useState } from 'react'
import { FiCamera } from "react-icons/fi"
import { processMessage } from '../api/backend'

export default function PhotoUploader({ onResult }) {
  const [loading, setLoading] = useState(false)

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1024
          let width = img.width
          let height = img.height
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width
            width = MAX_WIDTH
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(resolve, 'image/jpeg', 0.7)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const smallFile = await compressImage(file)
      const result = await processMessage({ 
        imageFile: smallFile, 
        language: "sw" 
      })
      onResult(result)
    } catch (err) {
      console.error("Frontend error:", err)
      onResult({ 
        success: false, 
        gptOutput: "Samahani, picha haikupakia vizuri. Jaribu tena na muunganisho mzuri wa intaneti." 
      })
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
        loading ? "bg-gray-400" : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105"
      } text-white`}>
        <FiCamera className="text-2xl" />
        {loading ? "Inachanganuliwa..." : "Piga Picha"}
      </label>
    </div>
  )
}
