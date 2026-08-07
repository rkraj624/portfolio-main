import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, Square, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioIntroduction({ personal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  const [hasCustomAudio, setHasCustomAudio] = useState(false);
  
  const audioRef = useRef(null);
  const synthTimerRef = useRef(null);

  const introText = `Hi, I am ${personal?.name || 'Ravi Raja'}, a Senior Backend Engineer specializing in Java, Spring Boot, Microservices, Apache Kafka, Redis, and High-Throughput Distributed Systems. I have built scalable enterprise architectures, solved over 750 Data Structures and Algorithms problems, and achieved 99.99% system uptime under peak traffic. I am actively looking for Senior Software Engineer and Backend Lead opportunities. Feel free to explore my portfolio and reach out to me!`;

  useEffect(() => {
    // Check if user has uploaded custom voice audio file at public/intro.mp3
    const customAudio = new Audio('/intro.mp3');
    customAudio.oncanplaythrough = () => {
      setHasCustomAudio(true);
    };
    customAudio.onerror = () => {
      setHasCustomAudio(false);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
      }
    };
  }, []);

  const handleStartOver = (e) => {
    e.stopPropagation();
    
    if (hasCustomAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    // 1. If user uploaded custom MP3 recording at public/intro.mp3
    if (hasCustomAudio) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/intro.mp3');
        
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current.duration) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
          }
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          if (audioRef.current) audioRef.current.currentTime = 0;
        };
      }

      if (isPlaying) {
        audioRef.current.pause(); // Pause at current bookmark position
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setShowNotification(false);
        }).catch(err => {
          console.error("Audio playback error:", err);
        });
      }
      return;
    }

    // 2. Fallback to Web Speech Synthesis with bookmark resume support
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause(); // Pause Web Speech at exact word bookmark
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        // Resume from paused bookmark
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setShowNotification(false);

        const estimatedDurationMs = 22000;
        const startProgress = progress;
        let startTime = Date.now();

        synthTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const addedProgress = (elapsed / estimatedDurationMs) * 100;
          const p = Math.min(startProgress + addedProgress, 99);
          setProgress(p);
        }, 100);

      } else {
        // Start fresh speech utterance
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(introText);
        utterance.rate = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
        if (naturalVoice) utterance.voice = naturalVoice;

        const estimatedDurationMs = 22000;
        let startTime = Date.now();

        synthTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const p = Math.min((elapsed / estimatedDurationMs) * 100, 99);
          setProgress(p);
        }, 100);

        utterance.onend = () => {
          if (synthTimerRef.current) clearInterval(synthTimerRef.current);
          setIsPlaying(false);
          setProgress(100);
          setTimeout(() => setProgress(0), 500);
        };

        utterance.onerror = () => {
          if (synthTimerRef.current) clearInterval(synthTimerRef.current);
          setIsPlaying(false);
          setProgress(0);
        };

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setShowNotification(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Tooltip Notification (Absolutely positioned to prevent layout shift) */}
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
              <span className="truncate">{hasCustomAudio ? "Listen to Ravi's Voice!" : "Listen to Audio Intro!"}</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              {hasCustomAudio 
                ? "Click to hear Ravi's personal voice recording." 
                : "Click to hear background, core skills, and job availability."}
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
          title={hasCustomAudio ? "Ravi's Personal Voice Recording" : "AI Voice Introduction"}
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
                  : hasCustomAudio ? "🎙️ Ravi's Voice" : '🎙️ Audio Intro'}
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
