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
import ChatInterface from './Components1/ChatBox';

function App() {


  return (
   <ChatInterface/>
  );
}

export default App;