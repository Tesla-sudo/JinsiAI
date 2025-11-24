// src/App.jsx
import React, { useState } from 'react';

import { FaCamera, FaMicrophone, FaCommentDots } from 'react-icons/fa';
import Header from './Components1/Header';
import FeatureCard from './Components1/FeatureCard';
import WeatherCard from './Components1/WeatherCard';
import RecentAnalysis from './Components1/RecentAnalysis';
import ImageAnalyzer from './Components1/ImageAnalyzer';
import VoiceQuery from './Components1/VoiceQuery';
import ChatBox from './Components1/ChatBox';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [result, setResult] = useState(null);

  const handleImageResult = (res) => {
    setResult(res);
    setActiveTab('results');
  };

  const handleVoiceResult = (res) => {
    setResult(res);
    setActiveTab('results');
  };

  const handleChatResult = (res) => {
    setResult(res);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {activeTab === 'home' && (
          <>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FeatureCard
                icon={({ className }) => <FaCamera className={className} />}
                title="Analyze Image"
                onClick={() => setActiveTab('image')}
              />
              <FeatureCard
                icon={({ className }) => <FaMicrophone className={className} />}
                title="Voice Query"
                onClick={() => setActiveTab('voice')}
              />
              <FeatureCard
                icon={({ className }) => <FaCommentDots className={className} />}
                title="Ask GPT for Tips"
                onClick={() => setActiveTab('chat')}
              />
            </div>

            <WeatherCard />
            <RecentAnalysis />
          </>
        )}

        {activeTab === 'image' && (
          <ImageAnalyzer
            onResult={handleImageResult}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceQuery
            onResult={handleVoiceResult}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'chat' && (
          <ChatBox
            onResult={handleChatResult}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'results' && result && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <button
              onClick={() => setActiveTab('home')}
              className="text-green-600 mb-4 flex items-center"
            >
              ← Back to Home
            </button>
            <h3 className="font-bold text-xl mb-3">AI Response</h3>
            <div className="prose max-w-none bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-gray-800 whitespace-pre-wrap">
                {result.gptOutput || result.response || result.textResponse}
              </p>
            </div>

            {result.audioFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">AI's Spoken Response:</p>
                <audio controls className="w-full">
                  <source src={result.audioFile} type="audio/mpeg" />
                  Your browser does not support audio.
                </audio>
              </div>
            )}

            {result.visionResult?.description?.captions?.[0]?.text && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>Image Description:</strong>{' '}
                  {result.visionResult.description.captions[0].text}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;