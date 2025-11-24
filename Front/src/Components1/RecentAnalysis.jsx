// src/components/RecentAnalysis.jsx
import React from 'react';
import { FaAppleAlt, FaLeaf } from 'react-icons/fa'; // replaced non-existent icons

const RecentAnalysis = () => {
  const analyses = [
    {
      crop: "Tomato",
      issue: "Early Blight",
      severity: "Medium Severity",
      icon: <FaAppleAlt className="text-red-500" />, // using apple icon as placeholder
    },
    {
      crop: "Corn",
      issue: "Aphids",
      severity: "Low Severity",
      icon: <FaLeaf className="text-yellow-600" />, // using leaf icon as placeholder
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Analysis</h2>
      <div className="space-y-4">
        {analyses.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm flex items-start">
            <div className="mr-3 mt-1">{item.icon}</div>
            <div>
              <p className="font-medium">{item.crop} – {item.issue}</p>
              <p className="text-sm text-gray-600">{item.severity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAnalysis;
