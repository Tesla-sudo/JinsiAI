import { FiDollarSign } from 'react-icons/fi'

export default function MarketPriceCard() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Bei ya Soko - Nairobi</p>
          <p className="text-2xl font-bold">Mahindi KSh 48/kg</p>
          <p className="text-sm mt-1">Uza Kariokor leo! +18%</p>
        </div>
        <FiDollarSign size={56} className="opacity-50" />
      </div>
    </div>
  )
}