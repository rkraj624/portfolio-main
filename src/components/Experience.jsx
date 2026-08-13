import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';
import { fadeInUp } from '../config/constants';

export default function Experience({ experience }) {
  return (
    <section id="experience" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp}
        className="flex items-center gap-3 mb-12"
      >
        <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          <Terminal size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Work Experience</h2>
          <p className="text-sm text-gray-300">Track record of building enterprise systems</p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {experience.map((exp, idx) => (
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.15 }} 
            variants={fadeInUp}
            key={idx} 
            className="p-6 sm:p-8 rounded-2xl bg-[#111827]/85 border border-white/15 relative overflow-hidden group hover:border-indigo-500/50 transition duration-300 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {exp.role} <span className="text-sky-400 text-base font-semibold">@ {exp.company}</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 border border-white/15 text-gray-200 w-max shadow-sm">
                {exp.period}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {exp.techStack.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-950/70 border border-indigo-500/40 text-indigo-200">
                  {tech}
                </span>
              ))}
            </div>

            <ul className="space-y-3">
              {exp.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-100 font-medium">
                  <ChevronRight size={16} className="text-sky-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
