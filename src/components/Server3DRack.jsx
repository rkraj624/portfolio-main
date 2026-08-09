import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, Database, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Server3DRack({ personal }) {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 12, y: -18 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth 3D tilt calculation
    setRotate({
      x: -(y / rect.height) * 25 + 8,
      y: (x / rect.width) * 25 - 12
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 8, y: -12 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm flex items-center justify-center cursor-grab active:cursor-grabbing select-none py-4"
      style={{ perspective: 1200 }}
    >
      {/* 3D Hologram Profile & Server Chassis Container */}
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-72 sm:w-80 bg-gradient-to-br from-[#111827]/95 via-[#0d1322]/98 to-[#111827]/95 border border-sky-500/30 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center backdrop-blur-2xl group hover:border-sky-400/60 transition-colors"
      >
        {/* Ambient Hologram Glow */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* 3D Floating Avatar Image */}
        <div className="relative mb-4" style={{ transform: 'translateZ(50px)' }}>
          <div className="absolute -inset-1 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-500" />
          <img 
            src={personal?.avatarUrl || "/avatar.jpg"} 
            alt={personal?.name || "Profile"} 
            className="w-36 h-36 rounded-2xl object-cover shadow-2xl relative border-2 border-white/20 group-hover:scale-105 transition duration-300"
          />
          <span className="absolute -bottom-2 -right-2 flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
          </span>
        </div>

        {/* Name & Title in 3D */}
        <div className="text-center space-y-1" style={{ transform: 'translateZ(35px)' }}>
          <h3 className="text-xl font-bold text-white tracking-tight">{personal?.name || "Ravi Kishan Raj"}</h3>
          <p className="text-xs text-sky-400 font-mono">Java & Distributed Systems Specialist</p>
        </div>

        {/* 3D Floating Server Blades Layer Stack */}
        <div className="w-full space-y-2.5 my-4" style={{ transform: 'translateZ(40px)' }}>
          
          {/* Blade 1: Spring Boot Microservices */}
          <div className="p-2.5 bg-[#090d16]/90 border border-sky-500/30 rounded-xl flex items-center justify-between shadow-lg hover:translate-x-1 transition duration-200">
            <div className="flex items-center gap-2">
              <Cpu size={15} className="text-emerald-400" />
              <div>
                <div className="text-[11px] font-bold text-white font-mono">Spring Boot Microservices</div>
                <div className="text-[9px] text-gray-400 font-mono">REST / AWS • 99.9% Uptime</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-sky-400">
              <Activity size={12} className="animate-spin" style={{ animationDuration: '4s' }} /> Active
            </div>
          </div>

          {/* Blade 2: Apache Kafka Event Bus */}
          <div className="p-2.5 bg-[#090d16]/90 border border-indigo-500/30 rounded-xl flex items-center justify-between shadow-lg hover:translate-x-1 transition duration-200">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-amber-400" />
              <div>
                <div className="text-[11px] font-bold text-white font-mono">Kafka & Redis</div>
                <div className="text-[9px] text-gray-400 font-mono">50K req/sec • Distributed Sync</div>
              </div>
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </div>

        </div>

        {/* 3D Footer Specs */}
        <div className="w-full pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400" style={{ transform: 'translateZ(25px)' }}>
          <span className="flex items-center gap-1 text-sky-400">
            <ShieldCheck size={13} /> TLS Encrypted
          </span>
          <span className="text-amber-300">Interactive 3D Tilt ⚡</span>
        </div>
      </motion.div>
    </div>
  );
}
