import { useState } from 'react'
import Home from "./pages/Home"
import AdminDashboard from './pages/AdminDashboard'
import CopilotEmbed from './components/CopilotEmbed'
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <>
    {/*Main View: Farmer or Admin */}
      {isAdmin ? <AdminDashboard /> : <Home />}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded text-xs z-50 transition"
      >
        {isAdmin ? "Farmer View" : "Admin"}
      </button>
      {/* Copilot Agent Button - Only visible in farmer view */}
      {!isAdmin && <CopilotEmbed />}
    </>
  )
}