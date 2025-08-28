import React, { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, User } from 'lucide-react';

export default function IncomingCallModal({ caller, onAccept, onReject }) {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create ringtone sound
    const playRingtone = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playBeep = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        };

        // Play ringtone pattern
        playBeep();
        setTimeout(playBeep, 600);
        
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio context error:', error);
      }
    };

    // Start ringtone immediately and repeat
    playRingtone();
    intervalRef.current = setInterval(playRingtone, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsPlaying(false);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Incoming Call</h2>
          <p className="text-gray-300 text-lg">{caller?.name || 'Unknown'}</p>
          <p className="text-gray-400 text-sm">{caller?.email}</p>
        </div>

        <div className="flex justify-center gap-8">
          <button
            onClick={onReject}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          >
            <PhoneOff size={24} className="text-white" />
          </button>
          
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors animate-pulse"
          >
            <Phone size={24} className="text-white" />
          </button>
        </div>

        <audio ref={audioRef} loop>
          <source src="/ringtone.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}
