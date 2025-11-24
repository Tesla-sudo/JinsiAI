// client/src/components/CopilotEmbed.jsx
import React, { useState, useEffect, useRef } from 'react';

const CopilotEmbed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const webChatRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const renderAttemptedRef = useRef(false);

  // Your Direct Line Secret (looks good – keep it)
  const DIRECT_LINE_SECRET = import.meta.env.VITE_AZURE_BOT_KEY;

  useEffect(() => {
    if (isOpen && !scriptLoadedRef.current) {
      // Load Web Chat script once
      const script = document.createElement('script');
      script.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js';
      script.async = true;
      script.crossOrigin = 'anonymous';  // Fix for CSP
      document.head.appendChild(script);

      script.onload = () => {
        scriptLoadedRef.current = true;
        // Poll for createDirectLine to be fully ready (fixes the .then error)
        const pollInterval = setInterval(() => {
          if (window.WebChat && typeof window.WebChat.createDirectLine === 'function') {
            clearInterval(pollInterval);
            
            renderWebChat();
          }
        }, 100);  // Check every 100ms – max 2-3 secs

        // Timeout after 5 secs if still not ready
        setTimeout(() => {
          clearInterval(pollInterval);
          if (!renderAttemptedRef.current) {
            renderWebChat();
          }
        }, 5000);
      };

      script.onerror = () => {
        console.error('Failed to load WebChat script');
      };
    } else if (isOpen && scriptLoadedRef.current && !renderAttemptedRef.current) {
      renderWebChat();
    }

    return () => {
      if (webChatRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        webChatRef.current.innerHTML = '';  // Clean up
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const renderWebChat = () => {
    renderAttemptedRef.current = true;
    if (!webChatRef.current || !window.WebChat || typeof window.WebChat.createDirectLine !== 'function') {
      webChatRef.current.innerHTML = '<div class="p-4 text-center text-red-500 text-sm">Loading agent... (Check console if stuck)</div>';
      return;
    }

    // Create DirectLine (no .then assumption – handle Promise or sync)
    const directLinePromise = window.WebChat.createDirectLine({ secret: DIRECT_LINE_SECRET });
    
    if (directLinePromise.then) {
      // If it's a Promise (async)
      directLinePromise
        .then((directLine) => {
          renderChat(directLine);
        })
        .catch((err) => {
          console.error('DirectLine connection failed:', err);
          webChatRef.current.innerHTML = '<div class="p-4 text-center text-red-500">Connection error – try refreshing. Demo: "Habari"</div>';
        });
    } else {
      // If sync (rare – old CDN)
      renderChat(directLinePromise);
    }
  };

  const renderChat = (directLine) => {
    window.WebChat.renderWebChat(
      {
        directLine,
        userID: 'farmer-' + Math.random().toString(36).substr(2, 9),
        username: 'Mkulima John',
        locale: 'sw-KE',
        styleOptions: {
          botAvatarInitials: 'JA',
          userAvatarInitials: 'MJ',
          botAvatarBackgroundColor: '#22c55e',
          primaryFont: 'Segoe UI, sans-serif',
          bubbleBackground: '#f0f9f4',
          bubbleTextColor: '#065f46',
          bubbleFromUserBackground: '#d1fae5',
          hideUploadButton: true,
          suggestedActionBackground: '#10b981',
        },
      },
      webChatRef.current
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl z-50 text-lg font-semibold animate-pulse md:bottom-8 md:right-8"
        title="Open JinsiAI Morning Agent"
      >
        🌅 Morning Agent
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-4/5 flex flex-col relative overflow-hidden md:max-w-lg">
            {/* Header */}
            <div className="p-4 bg-green-600 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-lg">JinsiAI Morning Agent</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold hover:opacity-80"
              >
                ×
              </button>
            </div>

            {/* Web Chat Container */}
            <div
              ref={webChatRef}
              className="flex-1 overflow-auto"
              style={{ minHeight: '400px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CopilotEmbed;