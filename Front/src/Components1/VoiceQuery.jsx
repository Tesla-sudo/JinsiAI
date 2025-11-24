// src/components/VoiceQuery.jsx
import React, { useState, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import LoadingSimulator from './LoadingSimulator';

const VoiceQuery = ({ onResult, onBack }) => {
  const [language, setLanguage] = useState('en-US'); // Note: Azure uses en-US, sw-KE, etc.
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or not supported.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSendAudio = async () => {
    if (chunksRef.current.length === 0) {
      alert('No audio recorded.');
      return;
    }

    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
    setAudioUrl(URL.createObjectURL(blob));

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    setIsProcessing(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/voice', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        // Revoke old URL
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        onResult({
          ...result,
          audioFile: `http://localhost:5000/${result.audioFile.replace(/\\/g, '/')}` // Ensure correct path
        });
      } else {
        alert('Voice processing failed: ' + (result.message || 'Unknown error'));
        console.error(result);
      }
    } catch (err) {
      console.error('Voice fetch error:', err);
      alert('Failed to reach voice API. Is backend running?');
    } finally {
      setIsProcessing(false);
    }
  };

  // After stopping recording, send automatically
  mediaRecorderRef.current?.addEventListener('stop', handleSendAudio, { once: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <button onClick={onBack} className="text-green-600 mb-4 flex items-center">
        ← Back
      </button>
      <h3 className="font-bold text-xl mb-4">Speak to AI Assistant</h3>
      <LanguageSelector
        language={language}
        setLanguage={(val) => setLanguage(val)}
      />

      <div className="flex flex-col items-center space-y-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Stop & Send
          </button>
        )}

        {audioUrl && (
          <div className="mt-4 w-full max-w-md">
            <p className="text-sm text-gray-600 mb-1">Your recording:</p>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>

      {isProcessing && <LoadingSimulator />}
    </div>
  );
};

export default VoiceQuery;