// src/components/FeatureCard.jsx
import React from 'react';
import { FaCamera, FaMicrophone, FaCommentDots } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-green-200 hover:bg-green-300 text-green-800 hover:scale-105'
      }`}
    >
      <Icon className="text-3xl mb-2" />
      <span className="text-center font-medium">{title}</span>
    </button>
  );
};

export default FeatureCard;