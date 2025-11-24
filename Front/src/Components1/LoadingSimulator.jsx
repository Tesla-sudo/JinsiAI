// src/components/LoadingSimulator.jsx
import React from 'react';

const LoadingSimulator = () => {
  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <span className="text-sm text-gray-600 ml-2">Thinking...</span>
    </div>
  );
};

export default LoadingSimulator;