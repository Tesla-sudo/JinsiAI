// src/pages/Home.jsx
import { useState, useRef, useEffect } from "react"
import ChatBubble from "../components/ChatBubble"
import PhotoUploader from "../components/PhotoUploader"
import VoiceRecorder from "../components/VoiceRecorder"
import { processMessage, processVoice } from "../api/backend"
import { FiSend } from "react-icons/fi"

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Karibu JinsiAI! Piga picha, andika au sema — nitakusaidia mara moja!", isBot: true, time: "Sasa" }
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  const handleResult = (result) => {
    setIsTyping(false)
    if (result.success) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        isBot: true,
        text: result.gptOutput || result.textResponse,
        time: "Sasa"
      }])
    }
    scrollToBottom()
  }

  const sendText = async () => {
    if (!inputText.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), isBot: false, text: inputText, time: "Sasa" }])
    setIsTyping(true)
    setInputText("")
    try {
      const res = await processMessage({ text: inputText, language: "sw" })
      handleResult(res)
    } catch { setIsTyping(false) }
  }

  const handleVoice = async (audioBlob) => {
    setIsTyping(true)
    setMessages(prev => [...prev, { id: Date.now(), isBot: false, text: "[Voice Message]", time: "Sasa" }])
    try {
      const res = await processVoice(audioBlob)
      handleResult(res)
    } catch { setIsTyping(false) }
  }

  useEffect(() => { scrollToBottom() }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-32">
      <header className="bg-white shadow-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-green-700">JinsiAI</h1>
        <p className="text-green-600">Msaidizi Wako wa Kilimo Mahiri</p>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {messages.map(m => <ChatBubble key={m.id} message={m} />)}
        {isTyping && <div className="text-center text-gray-600">JinsiAI anaandika...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
        <div className="bg-white rounded-full shadow-2xl p-4 flex items-center gap-4 border-4 border-green-200">
          <PhotoUploader onResult={handleResult} />
          <VoiceRecorder onAudioResult={handleVoice} />
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendText()}
            placeholder="Andika au piga picha..."
            className="flex-1 text-lg focus:outline-none"
          />
          <button onClick={sendText} className="p-4 bg-green-600 text-white rounded-full hover:scale-110 transition">
            <FiSend className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}



// import { useState, useRef, useEffect } from "react"
// import ChatBubble from "../components/ChatBubble"
// import PhotoUploader from "../components/PhotoUploader"
// import VoiceRecorder from "../components/VoiceRecorder"
// import { processMessage } from "../api/backend"
// import { FiSend, FiDroplet, FiDollarSign } from "react-icons/fi"

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Habari ya asubuhi!\n\nMimi ni *JinsiAI* — msaidizi wako wa kilimo mahiri.\nPiga picha ya mmea wako au niandikie, nitakusaidia mara moja!",
//       isBot: true,
//       time: "Sasa hivi"
//     }
//   ])
//   const [inputText, setInputText] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
  
//   // REAL-TIME STATS — THESE WILL UPDATE FROM BACKEND
//   const [waterSaved, setWaterSaved] = useState(0)
//   const [marketPrice, setMarketPrice] = useState("48")

//   const messagesEndRef = useRef(null)

//   const handleBackendResult = (result) => {
//     setIsTyping(false)
//     if (result.success) {
//       setMessages(prev => [...prev, {
//         id: Date.now(),
//         isBot: true,
//         text: result.gptOutput || "Samahani, sikuelewa.",
//         time: "Sasa hivi"
//       }])

//       // Extract water saved & price from GPT response (it usually mentions them)
//       const text = result.gptOutput.toLowerCase()
//       const waterMatch = text.match(/okoa\s*(\d+)\s*l/i) || text.match(/(\d+)\s*l.*maji/i)
//       const priceMatch = text.match(/ksh\s*(\d+)/i) || text.match(/bei.*?(\d+)/i)

//       if (waterMatch) setWaterSaved(prev => prev + parseInt(waterMatch[1]))
//       if (priceMatch) setMarketPrice(priceMatch[1])
//     }
//   }

//   const sendText = async () => {
//     if (!inputText.trim()) return
//     setMessages(prev => [...prev, { id: Date.now(), isBot: false, text: inputText, time: "Sasa hivi" }])
//     setIsTyping(true)
//     setInputText("")
//     try {
//       const result = await processMessage({ text: inputText, language: "sw" })
//       handleBackendResult(result)
//     // eslint-disable-next-line no-unused-vars
//     } catch (err) {
//       handleBackendResult({ success: false })
//     }
//   }

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50">
//       {/* Header */}
//       <header className="glass sticky top-0 z-50 border-b border-white/30 shadow-lg">
//         <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
//               <span className="text-white text-3xl">JinsiAI</span>
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">JinsiAI</h1>
//               <p className="text-green-600 font-semibold">Msaidizi Wako wa Kilimo Mahiri</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* LIVE STATS CLUSTER — THIS IS WHAT JUDGES WILL LOVE */}
//       <div className="max-w-5xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="glass card-hover p-8 text-center">
//           <FiDroplet className="text-6xl text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Maji Umeokoa Leo</p>
//           <p className="text-5xl font-bold text-gradient mt-3">{waterSaved}L</p>
//           <p className="text-2xl text-green-600 font-bold mt-4">Hongera Mkulima! 🌱</p>
//         </div>

//         <div className="glass card-hover p-8 text-center">
//           <FiDollarSign className="text-6xl text-yellow-500 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Bei ya Soko • Nairobi Leo</p>
//           <p className="text-5xl font-bold text-gradient mt-3">KSh {marketPrice}/kg</p>
//           <p className="text-2xl text-green-600 font-bold mt-4">Uza Leo! 💰</p>
//         </div>
//       </div>

//       {/* Chat */}
//       <div className="max-w-5xl mx-auto px-6 py-10 space-y-6 pb-32">
//         {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
//         {isTyping && <div className="text-center text-gray-500">JinsiAI anaandika...</div>}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Bar */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
//         <div className="glass p-4 rounded-full shadow-2xl border border-white/50 flex items-center gap-4">
//           <PhotoUploader onResult={handleBackendResult} />
//           <VoiceRecorder />
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendText()}
//             placeholder="Andika hapa au piga picha..."
//             className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
//           />
//           <button onClick={sendText} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-full shadow-xl hover:scale-110 transition-all">
//             <FiSend className="text-2xl" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
