import { useState, useRef } from "react"
import ChatBubble from "../components/ChatBubble"
import PhotoUploader from "../components/PhotoUploader"
import VoiceRecorder from "../components/VoiceRecorder"
import TypingIndicator from "../components/TypingIndicator"
import { FiSun, FiDroplet, FiDollarSign, FiHeart, FiSend } from "react-icons/fi"

export default function Home() {
const [messages, setMessages] = useState([{
  id: 1,
  text: "Habari ya asubuhi! ☀️\n\nMimi ni *JinsiAI* — msaidizi wako wa kilimo mahiri.\nPiga picha ya shamba lako, nitakutambua ugonjwa na kukushauri jinsi ya kulinda mazao yako na mazingira!",
  isBot: true,
  time: "6:30 AM"
}])
// eslint-disable-next-line no-unused-vars
const [_, setDiagnosis] = useState(null)

  // THIS IS THE MISSING FUNCTION — NOW FIXED
  const handleBackendResult = (result) => {
    if (result.success) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text: result.gptOutput || "Samahani, sikuelewa. Jaribu tena.",
        time: "Sasa hivi"
      }])
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text: "Hitilafu ya muunganisho. Angalia intaneti au jaribu tena baadaye.",
        time: "Sasa hivi"
      }])
    }
  }

  const messagesEndRef = useRef(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/30 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <FiSun className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">JinsiAI</h1>
              <p className="text-green-600 font-semibold">Msaidizi Wako wa Kilimo Mahiri</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">Online</span>
          </div>
        </div>
      </header>

      {/* Premium Cards */}
      <div className="max-w-5xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass card-hover p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-lg">Majira ya Umwagiliaji Leo</p>
              <p className="text-4xl font-bold text-gradient mt-3">Mwagia Kidogo Tu</p>
              <p className="text-xl text-green-600 font-semibold mt-4">Utaokoa <span className="text-3xl">28L</span> za maji</p>
            </div>
            <FiDroplet className="text-8xl text-blue-400 opacity-80" />
          </div>
        </div>

        <div className="glass card-hover p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-lg">Bei ya Soko • Nairobi</p>
              <p className="text-4xl font-bold text-gradient mt-3">KSh 48/kg</p>
              <p className="text-xl text-green-600 font-semibold mt-4">Uza Kariokor leo! +18%</p>
            </div>
            <FiDollarSign className="text-8xl text-yellow-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
        <div className="glass p-4 rounded-full shadow-2xl border border-white/50 flex items-center gap-4">
          <PhotoUploader onResult={handleBackendResult} />
          <VoiceRecorder />
          <input
            type="text"
            placeholder="Andika hapa..."
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
          />
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-full shadow-xl hover:scale-110 transition-all">
            <FiSend className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}
