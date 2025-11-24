// src/components/WeatherCard.jsx
import React from 'react';
import { FaSun, FaTint } from 'react-icons/fa';

const WeatherCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex items-center mb-4">
        <FaSun className="text-yellow-500 mr-2" />
        <span className="font-semibold">Weather: Sunny, 25°C</span>
      </div>
      <div className="flex items-center">
        <FaTint className="text-blue-500 mr-2" />
        <span className="font-semibold">Soil Moisture: 70%</span>
      </div>
    </div>
  );
};

export default WeatherCard;