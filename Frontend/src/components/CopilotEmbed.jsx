// client/src/components/CopilotEmbed.jsx
import React, { useState } from 'react';

const CopilotEmbed = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Direct embed URL from Copilot Studio (with __version__=2 to avoid caching issues)
  const botUrl =
    'https://copilotstudio.microsoft.com/environments/Default-b783208a-8014-4829-9589-5324f76470c8/bots/cr44c_jinsiAi/webchat?__version__=2';

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl z-50 text-lg font-semibold animate-pulse md:bottom-8 md:right-8"
        title="Open JinsiAI Morning Agent"
      >
        Morning Agent
      </button>

      {/* Full-screen Modal with Embedded Webchat */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-4/5 flex flex-col relative overflow-hidden md:max-w-lg">
            {/* Header */}
            <div className="p-4 bg-green-600 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-lg">JinsiAI Morning Agent</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-3xl font-bold hover:opacity-80 leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Embedded Bot via iframe */}
            <iframe
              src={botUrl}
              frameBorder="0"
              allow="microphone; camera; geolocation"
              className="flex-1 w-full h-full"
              title="JinsiAI Morning Agent"
            />

            {/* Optional: Footer note */}
            <div className="p-2 bg-gray-100 text-center text-xs text-gray-600">
              Powered by Microsoft Copilot Studio
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CopilotEmbed;