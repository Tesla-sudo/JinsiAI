// src/pages/AdminDashboard.jsx (or wherever your AdminDashboard is)
import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">JinsiAI Admin Dashboard</h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
        >
          Refresh Live Data
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-700">Disease Outbreaks</h2>
          <p className="text-4xl font-bold text-red-600 mt-4">Live from Power BI →</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-700">Total CO₂ Saved</h2>
          <p className="text-4xl font-bold text-green-600 mt-4">Live from Power BI →</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-700">Active Farmers</h2>
          <p className="text-4xl font-bold text-primary mt-4">Live from Power BI →</p>
        </div>
      </div>

      {/* Embedded Power BI Dashboard – FULL WIDTH & RESPONSIVE */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 text-center font-bold text-xl">
          Live Impact Dashboard – Real Farmers, Real Climate Wins
        </div>
        <div className="relative pb-[56.25%] h-0 overflow-hidden"> {/* 16:9 ratio */}
          <iframe
            title="JinsiAI Live Impact Dashboard"
            className="absolute top-0 left-0 w-full h-full"
            src="https://app.powerbi.com/reportEmbed?reportId=06d9a605-d22c-402f-b0a9-1e03d886965e&autoAuth=true&ctid=b783208a-8014-4829-9589-5324f76470c8"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center mt-8 text-gray-600 italic">
        Every time a farmer sends a photo or asks a question → this dashboard updates in real time!
      </p>
    </div>
  );
}