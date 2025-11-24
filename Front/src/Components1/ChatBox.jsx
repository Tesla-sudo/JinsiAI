// src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import LoadingSimulator from './LoadingSimulator';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('farmingChat');
    const savedLang = localStorage.getItem('farmingLang') || 'en';
    if (saved) setMessages(JSON.parse(saved));
    setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('farmingChat', JSON.stringify(messages));
    localStorage.setItem('farmingLang', language);
  }, [messages, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // === TEXT ===
  const sendTextMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text, type: 'text' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    await getAIResponse([...messages, userMsg]);
  };

  // === VOICE ===
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
      alert('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    const onStop = () => {
      if (chunksRef.current.length === 0) return;
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const userMsg = { role: 'user', content: '[Voice message]', type: 'voice', audioUrl: url };
      setMessages((prev) => [...prev, userMsg]);

      const file = new File([blob], 'voice.webm', { type: 'audio/webm' });
      sendVoiceToBackend(file);
    };

    recorder.addEventListener('stop', onStop);
    return () => recorder.removeEventListener('stop', onStop);
  }, [isRecording]);

  const sendVoiceToBackend = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);
    const azureLang = language === 'en' ? 'en-US' : language;
    formData.append('language', azureLang);

    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/voice', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        const aiMsg = {
          role: 'assistant',
          content: result.textResponse, // ← This is the transcribed text
          type: 'voice',
          audioUrl: result.audioFile.replace(/\\/g, '/'),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(result.message || 'Voice failed');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Voice error: ${err.message}`, type: 'text' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // === IMAGE ===
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const userMsg = { role: 'user', content: '[Image uploaded]', type: 'image', imageUrl: url };
    setMessages((prev) => [...prev, userMsg]);

    const formData = new FormData();
    formData.append('image', file);
    if (inputText.trim()) formData.append('text', inputText);
    formData.append('language', language);

    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/process', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.gptOutput, type: 'text' },
        ]);
      } else {
        throw new Error(result.message || 'Image analysis failed');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Image error: ${err.message}`, type: 'text' },
      ]);
    } finally {
      setIsSending(false);
      setInputText('');
    }
  };

  // === AI TEXT ===
  const getAIResponse = async (currentMessages) => {
    setIsSending(true);
    try {
      const context = currentMessages.slice(-4).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
      const prompt = `Previous conversation:\n${context}\n\nRespond helpfully to the latest user message.`;

      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, language }),
      });

      const result = await res.json();
      if (result.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.response, type: 'text' }]);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Error: ${err.message}`, type: 'text' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage(inputText);
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.type === "image" && msg.imageUrl) {
      return <img src={msg.imageUrl} alt="Uploaded crop" className="max-w-48 rounded mt-2" />;
    }


    if (msg.type === "voice") {
      return (
        <div>
          {/* Always show a visible label */}
          <p className="text-sm opacity-90 mb-1">
            {msg.role === 'user' ? '🎤 Your voice message' : '🔊 AI response'}
          </p>

          {/* Audio player */}
          {msg.audioUrl ? (
            <audio
              controls
              className="w-full mt-1"
              onError={(e) => console.error("Audio load error:", e.target.error)}
              onLoadedData={() => console.log("Audio loaded:", msg.audioUrl)}
            >
              <source src={msg.audioUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          ) : (
            <span className="text-gray-500 text-sm">Processing audio...</span>
          )}

          {/* Also show AI's transcribed text if available */}
          {msg.role === 'assistant' && msg.content && (
            <div className="mt-2">
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ✅ Fixed: Wrap ReactMarkdown in a div for styling
    return (
      <div className="prose prose-sm max-w-none text-gray-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            // Optional: handle links, code, etc.
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    );
  };
  const startNewChat = () => {
    setMessages([]);
    localStorage.removeItem('farmingChat');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 flex items-center">
          🌾 AI Farming Assistant
        </h1>
        <button onClick={startNewChat} className="text-sm text-green-600 hover:underline">
          + New Chat
        </button>
      </div>

      <div className="w-48 mb-4">
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>

      <div className="h-[70vh] overflow-y-auto bg-white rounded-xl shadow p-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="mb-2">💬 Ask about crops, pests, or upload a plant photo!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                  }`}
              >
                {renderMessageContent(msg)}
              </div>
            </div>
          ))
        )}
        {isSending && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-200">
              <LoadingSimulator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your farming question..."
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="2"
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <label className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full ${isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => sendTextMessage(inputText)}
            disabled={!inputText.trim() || isSending}
            className={`px-6 py-2 rounded-lg font-medium ${!inputText.trim() || isSending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;