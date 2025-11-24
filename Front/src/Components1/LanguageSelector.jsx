// src/components/LanguageSelector.jsx
import React from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw-KE', name: 'Swahili' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'hi', name: 'Hindi' },
];

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;