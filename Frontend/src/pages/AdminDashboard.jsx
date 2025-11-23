export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">JinsiAI Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold">Disease Outbreaks</h2>
          <p className="text-3xl font-bold text-red-600 mt-4">12 wards</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold">Total CO₂ Saved</h2>
          <p className="text-3xl font-bold text-green-600 mt-4">8.4 tons</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold">Active Farmers</h2>
          <p className="text-3xl font-bold text-primary mt-4">3,847</p>
        </div>
      </div>
      <p className="text-center mt-12 text-gray-600">Power BI dashboards will be embedded here</p>
    </div>
  )
}