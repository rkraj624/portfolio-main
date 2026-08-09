import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, fadeInUp, staggerContainer } from '../config/constants';
import Server3DRack from './Server3DRack';

export default function Hero({ personal, summary }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="about" className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        
        <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 border border-indigo-500/20 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for Senior Backend Roles
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Hi, I'm <span className="gradient-text">{personal.name}</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-medium text-gray-300">
            {personal.title}
          </h2>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            {summary}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {personal.stats.map((stat, idx) => (
              <motion.div 
                whileHover={{ scale: 1.05, translateY: -4 }}
                key={idx} 
                className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm shadow-md flex flex-col justify-between"
              >
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-sky-400 font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1 leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA & Social Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-semibold text-sm btn-3d"
            >
              {copiedEmail ? <Check size={18} className="text-emerald-400 icon-3d" /> : <Copy size={18} className="icon-3d" />}
              <span>{copiedEmail ? "Copied Email!" : personal.email}</span>
            </button>

            <div className="flex items-center gap-2">
              <a 
                href={personal.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/[0.05] hover:bg-indigo-600/20 hover:text-sky-400 border border-white/10 btn-3d"
                title="LinkedIn"
              >
                <LinkedinIcon size={20} className="icon-3d" />
              </a>
              <a 
                href={personal.github} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/[0.05] hover:bg-indigo-600/20 hover:text-sky-400 border border-white/10 btn-3d"
                title="GitHub"
              >
                <GithubIcon size={20} className="icon-3d" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* 3D Interactive Profile & Server Hologram Node */}
        <motion.div variants={fadeInUp} className="lg:col-span-5 flex justify-center">
          <Server3DRack personal={personal} />
        </motion.div>

      </motion.div>
    </section>
  );
}
