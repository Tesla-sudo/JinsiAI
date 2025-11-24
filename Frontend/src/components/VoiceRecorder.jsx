// src/components/VoiceRecorder.jsx
import { useState, useRef } from 'react';
import { FiMic, FiMicOff, FiSend } from 'react-icons/fi';

export default function VoiceRecorder({ onAudioResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsProcessing(true);
        onAudioResult(blob); // This triggers processVoice in Home.jsx
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setAudioUrl(null); // Clear previous audio
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Ruhusa ya maikrofoni imekataliwa. Tafadhali iruhusu kwenye kivinjari chako.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Optional: Reset after processing (called from parent if needed)
  // eslint-disable-next-line no-unused-vars
  const reset = () => {
    setAudioUrl(null);
    setIsProcessing(false);
  };

  // Auto-reset when processing ends (you can call reset() from Home.jsx if you want)
  if (isProcessing && !isRecording && audioUrl) {
    setTimeout(() => setIsProcessing(false), 3000);
  }

  return (
    <div className="flex items-center gap-3">
      {/* Recording Button */}
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className={`p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
            isProcessing 
              ? "bg-gray-500 cursor-not-allowed animate-spin" 
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-green-500/50"
          }`}
          title="Bonyeza kurekodi sauti"
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiMic className="text-2xl" />
          )}
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="p-5 bg-red-600 text-white rounded-full shadow-2xl animate-pulse ring-4 ring-red-400"
          title="Bonyeza kusitisha"
        >
          <FiMicOff className="text-2xl" />
        </button>
      )}

      {/* Optional: Show audio preview */}
      {audioUrl && !isRecording && (
        <audio 
          controls 
          src={audioUrl} 
          className="h-10 rounded-lg"
          onEnded={() => setAudioUrl(null)}
        />
      )}

      {/* Visual feedback */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
          <span className="text-sm">Inarekodi...</span>
        </div>
      )}

      {isProcessing && !isRecording && (
        <span className="text-emerald-400 font-medium text-sm animate-pulse">
          Inachakatwa...
        </span>
      )}
    </div>
  );
}


// import { useState } from 'react'
// import { FiMic, FiMicOff } from "react-icons/fi"

// export default function VoiceRecorder() {
//   const [isRecording, setIsRecording] = useState(false)

//   const handleClick = () => {
//     setIsRecording(prev => !prev)
//     // Optional: add real recording later
//     if (!isRecording) {
//       setTimeout(() => {
//         alert("Voice recording will be added in final version! For now, just type or take photo")
//         setIsRecording(false)
//       }, 2000)
//     }
//   }

//   return (
//     <button
//       onClick={handleClick}
//       className={`p-4 rounded-full shadow-xl transition-all ${
//         isRecording 
//           ? "bg-red-500 animate-pulse" 
//           : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-110"
//       } text-white`}
//     >
//       {isRecording ? <FiMicOff className="text-2xl" /> : <FiMic className="text-2xl" />}
//     </button>
//   )
// }
