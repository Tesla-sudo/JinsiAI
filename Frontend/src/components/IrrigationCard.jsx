import { FiDroplet } from 'react-icons/fi'

export default function IrrigationCard() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Majira ya Umwagiliaji Leo</p>
          <p className="text-2xl font-bold">Mwagia kidogo tu</p>
          <p className="text-sm mt-1">Utaokoa <strong>22 lita</strong> na <strong>0.8 kg CO₂</strong></p>
        </div>
        <FiDroplet size={56} className="opacity-50" />
      </div>
    </div>
  )
}