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
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Terminal size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Work Experience</h2>
          <p className="text-sm text-gray-400">Track record of building enterprise systems</p>
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
            className="p-6 sm:p-8 rounded-2xl bg-[#111827]/60 border border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {exp.role} <span className="text-sky-400 text-sm font-normal">@ {exp.company}</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300 w-max">
                {exp.period}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {exp.techStack.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                  {tech}
                </span>
              ))}
            </div>

            <ul className="space-y-3">
              {exp.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <ChevronRight size={18} className="text-sky-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
