export default function ChatBubble({ message }) {
  if (message.diagnosis) {
    const d = message.diagnosis
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl max-w-2xl border-2 border-green-200 shadow-xl">
        <h3 className="text-2xl font-bold text-green-800">Ugonjwa Umetambuliwa:</h3>
        <p className="text-3xl font-black text-gradient mt-2">{d.swahili}</p>
        <p className="text-lg text-gray-700 mt-1">({d.disease} • {d.confidence}%)</p>
        
        <div className="mt-5 p-5 bg-white rounded-2xl shadow-inner">
          <p className="font-bold text-gray-800">Suluhisho:</p>
          <p className="text-lg mt-2">{d.solution}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-3xl font-bold text-blue-600">{d.waterSaved}L</p>
            <p className="text-sm">Maji umeokoa</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl">
            <p className="text-3xl font-bold text-red-600">{d.co2Saved}kg</p>
            <p className="text-sm">CO₂ haikutoka</p>
          </div>
        </div>

        <p className="mt-5 text-green-700 font-bold">Hongera! Umeokoa mazingira </p>
      </div>
    )
  }

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-md px-6 py-4 rounded-3xl ${message.isBot ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p className="text-xs mt-2 opacity-70">{message.time}</p>
      </div>
    </div>
  )
}
