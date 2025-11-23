import { useState } from 'react'
import Home from "./pages/Home"
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <>
      {isAdmin ? <AdminDashboard /> : <Home />}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded text-xs z-50"
      >
        {isAdmin ? "Farmer View" : "Admin"}
      </button>
    </>
  )
}