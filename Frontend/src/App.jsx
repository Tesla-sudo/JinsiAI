// src/App.jsx
import { useState } from 'react'
import Home from "./pages/Home"
import AdminDashboard from './pages/AdminDashboard'
import CopilotEmbed from './components/CopilotEmbed'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <>
      {/* Main View */}
      {isAdmin ? <AdminDashboard /> : <Home />}

      {/* Admin Toggle Button */}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-4 right-4 z-50 bg-black/80 hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all flex items-center gap-3"
      >
        {isAdmin ? "Mkulima View" : "Admin Dashboard"}
      </button>

      {/* Morning Agent - Only in Farmer View */}
      {!isAdmin && <CopilotEmbed />}
    </>
  )
}



// import { useState } from 'react'
// import Home from "./pages/Home"
// import AdminDashboard from './pages/AdminDashboard'
// import CopilotEmbed from './components/CopilotEmbed'
// export default function App() {
//   const [isAdmin, setIsAdmin] = useState(false)

//   return (
//     <>
//     {/*Main View: Farmer or Admin */}
//       {isAdmin ? <AdminDashboard /> : <Home />}
//       <button
//         onClick={() => setIsAdmin(!isAdmin)}
//         className="fixed top-4 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded text-xs z-50 transition"
//       >
//         {isAdmin ? "Farmer View" : "Admin"}
//       </button>
//       {/* Copilot Agent Button - Only visible in farmer view */}
//       {!isAdmin && <CopilotEmbed />}
//     </>
//   )
// }