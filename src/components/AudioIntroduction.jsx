import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, Square, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioIntroduction() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  
  const audioRef = useRef(null);

  useEffect(() => {
    // Custom voice recording player initialized from public/intro.mp3
    audioRef.current = new Audio('/intro.mp3');

    audioRef.current.ontimeupdate = () => {
      if (audioRef.current && audioRef.current.duration) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStartOver = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause(); // Bookmark pause position
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowNotification(false);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Tooltip Notification */}
      <AnimatePresence>
        {showNotification && !isPlaying && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="absolute bottom-full right-0 mb-3 p-3 rounded-2xl bg-[#111827]/95 border border-sky-500/40 backdrop-blur-xl shadow-2xl w-56 text-xs text-gray-200 space-y-1 relative pointer-events-auto"
          >
            <button 
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-[10px] font-bold p-1"
            >
              ✕
            </button>
            <div className="flex items-center gap-1.5 font-bold text-sky-400 pr-4">
              <Sparkles size={14} className="text-amber-400 shrink-0 animate-spin" />
              <span className="truncate">Listen to Ravi's Voice!</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              Click to hear Ravi's personal voice introduction.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Audio Control Button Group */}
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {(isPlaying || progress > 0) && (
            <motion.button
              key="reset-btn"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartOver}
              className="p-3 rounded-2xl bg-[#111827]/90 hover:bg-[#111827] text-gray-300 hover:text-sky-400 border border-sky-500/40 shadow-2xl backdrop-blur-xl shrink-0 flex items-center justify-center"
              title="Start Over from 0%"
            >
              <RotateCcw size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleTogglePlay}
          className={`relative overflow-hidden flex items-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-xs border shadow-2xl transition-colors duration-300 ${
            isPlaying 
              ? 'bg-[#111827] text-white border-sky-500/60 shadow-sky-500/30 min-w-[140px]'
              : 'bg-[#111827]/90 hover:bg-[#111827] text-sky-300 border-sky-500/40 shadow-sky-500/20 backdrop-blur-xl min-w-[130px]'
          }`}
          title="Ravi's Personal Voice Recording"
        >
          {/* Animated Background Progress Fill Bar */}
          <div 
            className="absolute inset-y-0 left-0 bg-sky-500/20 pointer-events-none transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />

          <div className="relative z-10 flex items-center justify-center gap-2 w-full">
            {isPlaying ? (
              <Square size={14} className="text-rose-400 fill-rose-400 shrink-0" />
            ) : (
              <Volume2 size={18} className="text-sky-400 shrink-0 animate-bounce" />
            )}

            {/* Equalizer Sound Waves Animation */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5 px-0.5 shrink-0">
                <span className="w-0.5 h-full bg-sky-400 rounded-full animate-[bounce_0.6s_infinite_100ms]" />
                <span className="w-0.5 h-full bg-indigo-400 rounded-full animate-[bounce_0.6s_infinite_300ms]" />
                <span className="w-0.5 h-full bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_200ms]" />
              </div>
            )}

            <span className="font-mono text-xs whitespace-nowrap">
              {isPlaying 
                ? `${Math.floor(progress)}%` 
                : progress > 0 
                  ? `Resume (${Math.floor(progress)}%)`
                  : "🎙️ Ravi's Voice"}
            </span>
          </div>

          {/* Outer Border Glowing Progress Ring Line */}
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </motion.button>
      </div>

    </div>
  );
}
