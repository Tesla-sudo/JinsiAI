import { FiHeart } from 'react-icons/fi'

export default function CarbonScore({ savedWater = 0, savedCO2 = 0 }) {
  return (
    <div className="bg-green-100 text-green-800 rounded-xl p-3 mt-3 text-sm border border-green-200">
      <div className="flex items-center gap-2 font-bold">
        <FiHeart /> Umefanya poa sana!
      </div>
      <p>Umeokoa <strong>{savedWater} lita</strong> za maji na <strong>{savedCO2} kg CO₂</strong> wiki hii</p>
    </div>
  )
}