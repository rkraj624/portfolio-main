import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Shield, Zap, CheckCircle2 } from 'lucide-react';

export default function TechLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Initializing JVM Runtime & Spring Context...", icon: <Terminal size={16} className="text-sky-400" /> },
    { label: "Connecting Kafka Event Streams & Redis Cache...", icon: <Zap size={16} className="text-amber-400" /> },
    { label: "Loading Microservices Mesh & Distributed Systems...", icon: <Cpu size={16} className="text-indigo-400" /> },
    { label: "Applying Security Protocols & Spring Security...", icon: <Shield size={16} className="text-emerald-400" /> },
    { label: "Ravi Raja Portfolio System Ready!", icon: <CheckCircle2 size={16} className="text-emerald-400" /> }
  ];

  useEffect(() => {
    // 10-second system boot loading sequence
    const totalDurationMs = 1500; // ~9.5 seconds + 500ms pause at 100% = 10s total
    const intervalMs = 100;
    const totalTicks = totalDurationMs / intervalMs;
    const incrementPerTick = 100 / totalTicks;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        const next = prev + incrementPerTick;
        return next > 100 ? 100 : Math.floor(next);
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 85) setCurrentStep(4);
    else if (progress > 65) setCurrentStep(3);
    else if (progress > 40) setCurrentStep(2);
    else if (progress > 15) setCurrentStep(1);
    else setCurrentStep(0);
  }, [progress]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed inset-0 z-50 bg-[#090d16] flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
        
        {/* Animated Brand Logo Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-[1px] shadow-2xl shadow-indigo-500/30">
            <div className="w-full h-full bg-[#111827] rounded-2xl flex items-center justify-center font-mono font-bold text-2xl tracking-tighter text-white">
              RR<span className="text-sky-400">.java</span>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </motion.div>

        {/* Title & Role */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-1"
        >
          <h2 className="text-xl font-bold tracking-tight text-white font-mono">
            Ravi Raja <span className="text-sky-400 text-sm">System Architect</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono">Senior Backend Engineer • Distributed Systems</p>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              SYSTEM_BOOT_SEQUENCE
            </span>
            <span className="text-indigo-300 font-bold">{progress}%</span>
          </div>

          {/* Outer Track */}
          <div className="h-2.5 w-full bg-[#111827] border border-white/10 rounded-full overflow-hidden p-0.5 shadow-inner">
            {/* Animated Progress Fill */}
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Dynamic Log Step Display */}
        <div className="w-full bg-[#111827]/80 border border-white/10 rounded-xl p-3.5 backdrop-blur-md min-h-[52px] flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 text-xs font-mono text-gray-300 w-full"
            >
              {steps[currentStep].icon}
              <span className="truncate">{steps[currentStep].label}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Technical Stack Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-gray-500"
        >
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Java</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Spring Boot</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Kafka</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Redis</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Microservices</span>
        </motion.div>

      </div>
    </motion.div>
  );
}
