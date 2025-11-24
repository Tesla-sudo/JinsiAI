// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiRefreshCw, FiWind, FiDroplet, FiDollarSign, FiUsers } from 'react-icons/fi';

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({
    totalCO2: 0,
    totalWater: 0,
    totalIncome: 0,
    activeFarmers: 0,
    cropBreakdown: [],
    diseaseByCrop: [],
    locationData: []
  });

  const baseUrl = "https://app.powerbi.com/reportEmbed?reportId=06d9a605-d22c-402f-b0a9-1e03d886965e&autoAuth=true&ctid=b783208a-8014-4829-9589-5324f76470c8";
  const pages = ["ReportSection", "ReportSection1", "ReportSection2", "ReportSection3"];
  const tabNames = ["Disease Map", "Water Saved", "CO₂ Saved", "Income Generated"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/data/farmer_data.csv');
        const text = await res.text();
        const lines = text.trim().split('\n').slice(1);

        let co2 = 0, water = 0, income = 0;
        const farmers = new Set();
        const crops = {}, diseases = {}, locations = {};

        lines.forEach(line => {
          const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
          if (cols.length < 10) return;

          // eslint-disable-next-line no-unused-vars
          const [,, type, disease, co2kg, waterL, loc, inc, crop] = cols;

          co2 += parseFloat(co2kg) || 0;
          water += parseFloat(waterL) || 0;
          income += parseFloat(inc) || 0;
          if (cols[1]) farmers.add(cols[1]);

          // Count crops
          if (crop && crop !== 'Unknown') {
            crops[crop] = (crops[crop] || 0) + 1;
          }

          // Disease by crop
          if (disease && disease !== 'None' && crop) {
            const key = `${disease} (${crop})`;
            diseases[key] = (diseases[key] || 0) + 1;
          }

          // Location
          if (loc && loc !== 'Unknown') {
            locations[loc] = (locations[loc] || 0) + 1;
          }
        });

        setData({
          totalCO2: co2.toFixed(1),
          totalWater: Math.round(water),
          totalIncome: Math.round(income),
          activeFarmers: farmers.size,
          cropBreakdown: Object.entries(crops).map(([name, value]) => ({ name, value })),
          diseaseByCrop: Object.entries(diseases).map(([name, value]) => ({ name, value })).slice(0, 6),
          locationData: Object.entries(locations).map(([name, value]) => ({ name, value }))
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.log("Waiting for data...");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-black text-white p-6">
      <div className="text-center py-10">
        <h1 className="text-7xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          JINSIAI LIVE IMPACT
        </h1>
        <p className="text-3xl mt-4">Real-time Climate & Income Dashboard</p>
      </div>

      {/* LIVE STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
        {[
          { icon: FiWind, label: "CO₂ Saved", value: data.totalCO2 + " kg", color: "from-green-500 to-emerald-600" },
          { icon: FiDroplet, label: "Water Saved", value: data.totalWater + " L", color: "from-cyan-500 to-blue-600" },
          { icon: FiDollarSign, label: "Income", value: "KSh " + data.totalIncome.toLocaleString(), color: "from-yellow-500 to-orange-600" },
          { icon: FiUsers, label: "Farmers", value: data.activeFarmers, color: "from-purple-500 to-pink-600" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} p-8 rounded-3xl shadow-2xl`}>
            <s.icon className="text-6xl mb-4" />
            <p className="text-5xl font-black">{s.value}</p>
            <p className="text-xl">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        {/* Crop Distribution Pie */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.cropBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.cropBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Diseases Bar */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Top 6 Diseases Detected</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.diseaseByCrop}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Power BI Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-6 mb-8">
          {tabNames.map((name, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`px-10 py-5 rounded-2xl text-2xl font-bold transition-all ${tab === i ? 'bg-green-500 scale-110 shadow-2xl' : 'bg-white/20'}`}
            >
              {name}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="block mx-auto mb-10 bg-gradient-to-r from-yellow-400 to-red-600 px-16 py-8 rounded-full text-4xl font-bold shadow-2xl animate-bounce"
        >
          REFRESH LIVE DATA
        </button>

        <div className="bg-black/70 rounded-3xl overflow-hidden border-8 border-green-500 shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 text-center text-4xl font-black">
            {tabNames[tab]} — REAL-TIME FROM FARMERS
          </div>
          <iframe
            src={`${baseUrl}&pageName=${pages[tab]}`}
            className="w-full h-screen min-h-[800px]"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}


// // src/pages/AdminDashboard.jsx
// import React, { useState } from 'react';

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState(1);

//   // Your exact Power BI embed URL (with your report ID)
//   const baseUrl = "https://app.powerbi.com/reportEmbed?reportId=06d9a605-d22c-402f-b0a9-1e03d886965e&autoAuth=true&ctid=b783208a-8014-4829-9589-5324f76470c8";

//   // Add page parameter to go to specific page
//   const getPageUrl = (pageName) => `${baseUrl}&pageName=${pageName}`;

//   return (
//     <div className="min-vh-100 bg-gray-50 p-4 md:p-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
//           JinsiAI Live Impact Dashboard
//         </h1>
//         <p className="text-lg text-gray-600">
//           Real-time climate & income impact from Kenyan farmers
//         </p>
//       </div>

//       {/* Tabs — Matches your Power BI pages exactly */}
//       <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab(1)}
//           className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
//             activeTab === 1 
//               ? 'bg-red-600 text-white shadow-2xl scale-105' 
//               : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           Disease Outbreaks
//         </button>
//         <button
//           onClick={() => setActiveTab(2)}
//           className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
//             activeTab === 2 
//               ? 'bg-blue-600 text-white shadow-2xl scale-105' 
//               : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           Water Saved (Liters)
//         </button>
//         <button
//           onClick={() => setActiveTab(3)}
//           className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
//             activeTab === 3 
//               ? 'bg-green-600 text-white shadow-2xl scale-105' 
//               : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           CO₂ Saved (kg)
//         </button>
//         <button
//           onClick={() => setActiveTab(4)}
//           className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
//             activeTab === 4 
//               ? 'bg-yellow-600 text-white shadow-2xl scale-105' 
//               : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           Income Impact (KSh)
//         </button>
//       </div>

//       {/* Live Data Refresh Button */}
//       <div className="text-center mb-6">
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-4 px-10 rounded-full text-xl shadow-2xl transform hover:scale-105 transition"
//         >
//           Refresh Live Data Now
//         </button>
//       </div>

//       {/* Power BI Embed — Full width, responsive */}
//       <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-300">
//         <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-4 text-center font-bold text-xl">
//           {activeTab === 1 && "Disease Outbreaks Across Kenya"}
//           {activeTab === 2 && "Water Saved by Climate-Smart Advice"}
//           {activeTab === 3 && "CO₂ Emissions Prevented (kg)"}
//           {activeTab === 4 && "Income Generated for Farmers (KSh)"}
//         </div>

//         <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
//           <iframe
//             title="JinsiAI Dashboard"
//             className="absolute top-0 left-0 w-full h-full"
//             src={
//               activeTab === 1 ? getPageUrl("ReportSection") :           // Page 1: Disease
//               activeTab === 2 ? getPageUrl("ReportSection1") :          // Page 2: Water
//               activeTab === 3 ? getPageUrl("ReportSection2") :          // Page 3: CO2
//                                 getPageUrl("ReportSection3")            // Page 4: Income
//             }
//             frameBorder="0"
//             allowFullScreen={true}
//           ></iframe>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="text-center mt-10 text-gray-700 text-lg font-medium">
//         Every photo, voice note, or text from a farmer → appears here in real time.
//         <br />
//         <span className="text-green-600 font-bold">This is the future of African agriculture.</span>
//       </div>
//     </div>
//   );
// }






// // // src/pages/AdminDashboard.jsx (or wherever your AdminDashboard is)
// // import React from 'react';

// // export default function AdminDashboard() {
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-8">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <h1 className="text-4xl font-bold text-primary">JinsiAI Admin Dashboard</h1>
// //         <button
// //           onClick={() => window.location.reload()}
// //           className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
// //         >
// //           Refresh Live Data
// //         </button>
// //       </div>

// //       {/* Top Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
// //         <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
// //           <h2 className="text-xl font-bold text-gray-700">Disease Outbreaks</h2>
// //           <p className="text-4xl font-bold text-red-600 mt-4">Live from Power BI →</p>
// //         </div>
// //         <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
// //           <h2 className="text-xl font-bold text-gray-700">Total CO₂ Saved</h2>
// //           <p className="text-4xl font-bold text-green-600 mt-4">Live from Power BI →</p>
// //         </div>
// //         <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
// //           <h2 className="text-xl font-bold text-gray-700">Active Farmers</h2>
// //           <p className="text-4xl font-bold text-primary mt-4">Live from Power BI →</p>
// //         </div>
// //       </div>

// //       {/* Embedded Power BI Dashboard – FULL WIDTH & RESPONSIVE */}
// //       <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
// //         <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 text-center font-bold text-xl">
// //           Live Impact Dashboard – Real Farmers, Real Climate Wins
// //         </div>
// //         <div className="relative pb-[56.25%] h-0 overflow-hidden"> {/* 16:9 ratio */}
// //           <iframe
// //             title="JinsiAI Live Impact Dashboard"
// //             className="absolute top-0 left-0 w-full h-full"
// //             src="https://app.powerbi.com/reportEmbed?reportId=06d9a605-d22c-402f-b0a9-1e03d886965e&autoAuth=true&ctid=b783208a-8014-4829-9589-5324f76470c8"
// //             frameBorder="0"
// //             allowFullScreen={true}
// //           ></iframe>
// //         </div>
// //       </div>

// //       {/* Footer Note */}
// //       <p className="text-center mt-8 text-gray-600 italic">
// //         Every time a farmer sends a photo or asks a question → this dashboard updates in real time!
// //       </p>
// //     </div>
// //   );
// // }