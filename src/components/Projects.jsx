import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../config/constants';

export default function Projects({ keyProjects, personalProjects }) {
  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp}
        className="flex items-center gap-3 mb-12"
      >
        <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Cpu size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Projects & Architecture</h2>
          <p className="text-sm text-gray-400">High-scale backend solutions designed and delivered</p>
        </div>
      </motion.div>

      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.15 }} 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {keyProjects.map((project, idx) => (
          <motion.div 
            variants={fadeInUp}
            whileHover={{ translateY: -6 }}
            key={idx} 
            className="p-6 rounded-2xl bg-[#111827]/70 border border-white/10 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="text-xs font-mono text-sky-400 mb-1">{project.client}</div>
              <h3 className="text-lg font-bold text-white mb-3">{project.title}</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">{project.description}</p>
              
              <div className="space-y-3 mb-6">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <Zap size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Personal Projects Highlight */}
      {personalProjects && personalProjects.length > 0 && (
        <div className="mt-12 space-y-6">
          {personalProjects.map((pProj, pIdx) => (
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.15 }} 
              variants={fadeInUp}
              key={pIdx}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-sky-950/40 border border-indigo-500/30 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-sky-400">Personal Open Source Project #{pIdx + 1}</span>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
                    {pProj.name}
                    {pProj.github && (
                      <a href={pProj.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{pProj.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pProj.tech && pProj.tech.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/10 text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pProj.features && pProj.features.map((feat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
