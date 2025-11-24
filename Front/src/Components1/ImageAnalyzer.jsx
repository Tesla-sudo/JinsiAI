// src/components/ImageAnalyzer.jsx
import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import LoadingSimulator from './LoadingSimulator';

const ImageAnalyzer = ({ onResult, onBack }) => {
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !text.trim()) {
      alert('Please provide an image or text.');
      return;
    }

    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile);
    if (text) formData.append('text', text);
    formData.append('language', language);

    setIsProcessing(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/process', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        onResult(result);
      } else {
        alert('Error: ' + (result.message || 'Failed to process'));
        console.error('Backend error:', result);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error. Is your backend running?');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <button onClick={onBack} className="text-green-600 mb-4 flex items-center">
        ← Back
      </button>
      <h3 className="font-bold text-xl mb-4">Analyze Crop Image</h3>
      <LanguageSelector language={language} setLanguage={setLanguage} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you see..."
            className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg font-medium ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isProcessing ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {isProcessing && <LoadingSimulator />}
    </div>
  );
};

export default ImageAnalyzer;