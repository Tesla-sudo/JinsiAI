import { useState } from 'react'
import { FiCamera } from "react-icons/fi"

export default function PhotoUploader({ onDiagnosis }) {
  const [preview, setPreview] = useState(null)

  const mockDiagnose = () => {
    // Simulate AI processing (in real app: send to Grok-2 Vision / Gemini / your backend)
    const diseases = [
      { name: "Fall Armyworm", swahili: "Mnyauko", confidence: 94, solution: "Nyunyizia Emamectin Benzoate mara 2 wiki hii" },
      { name: "Maize Lethal Necrosis", swahili: "Kuoza kwa Mahindi", confidence: 88, solution: "Tumia mbegu sugu na epuka kupanda mara mbili msimu mmoja" },
      { name: "Bean Rust", swahili: "Kutu ya Maharage", confidence: 91, solution: "Nyunyizia Mancozeb 80% WP" },
      { name: "Tomato Blight", swahili: "Ukungu wa Nyanya", confidence: 96, solution: "Nyunyizia Ridomil Gold mara moja kwa wiki" },
      { name: "Cassava Mosaic", swahili: "Madoa ya Muhogo", confidence: 89, solution: "Tumia mbegu sugu kama Tajirika au Sauti" }
    ]

    const result = diseases[Math.floor(Math.random() * diseases.length)]

    setTimeout(() => {
      onDiagnosis?.({
        disease: result.name,
        swahili: result.swahili,
        confidence: result.confidence,
        solution: result.solution,
        waterSaved: Math.floor(Math.random() * 40) + 15,
        co2Saved: (Math.random() * 1.5 + 0.5).toFixed(1)
      })
    }, 2800)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        mockDiagnose()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="absolute inset-0 opacity-0 cursor-pointer"
        id="photo-upload"
      />
      <label
        htmlFor="photo-upload"
        className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer font-medium"
      >
        <FiCamera className="text-2xl" />
        {preview ? "Picha Imetumwa" : "Piga Picha"}
      </label>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Shamba" className="w-full max-w-sm rounded-2xl shadow-2xl border-4 border-green-200" />
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-2xl animate-pulse">
            <p className="text-yellow-800 font-bold">Inachanganuliwa na AI...</p>
          </div>
        </div>
      )}
    </div>
  )
}
