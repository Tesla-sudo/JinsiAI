// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800">
        Hello, <br />
        <span className="text-green-700">John Farmer!</span>
        <span className="text-green-500 ml-2">🌱</span>
      </h1>
    </div>
  );
};

export default Header;