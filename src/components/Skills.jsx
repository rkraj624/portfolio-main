import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layers, Shield, Cloud, MessageSquare, Database, Server } from 'lucide-react';
import { SKILL_ICONS, fadeInUp, staggerContainer } from '../config/constants';

const CATEGORY_ICONS = {
  "Languages": <Code2 className="text-sky-400" size={18} />,
  "Frameworks & Security": <Shield className="text-indigo-400" size={18} />,
  "Cloud & DevOps": <Cloud className="text-cyan-400" size={18} />,
  "Messaging & Caching": <MessageSquare className="text-purple-400" size={18} />,
  "Databases": <Database className="text-amber-400" size={18} />,
  "Architecture & CS": <Server className="text-emerald-400" size={18} />
};

export default function Skills({ skills }) {
  return (
    <section id="skills" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp}
        className="flex items-center gap-3 mb-12"
      >
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Code2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Skills & Technologies</h2>
          <p className="text-sm text-gray-400">Comprehensive backend & distributed systems stack with visual icons</p>
        </div>
      </motion.div>

      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.15 }} 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skills.map((group, idx) => (
          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            key={idx} 
            className="p-6 rounded-2xl bg-[#111827]/60 border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-xl"
          >
            <h3 className="text-base font-semibold text-white mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>{group.category}</span>
              {CATEGORY_ICONS[group.category] || <Layers size={16} className="text-purple-400" />}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item, i) => (
                <motion.span 
                  whileHover={{ scale: 1.08 }}
                  key={i} 
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-indigo-600/20 hover:text-white text-gray-200 border border-white/10 flex items-center gap-1.5 transition cursor-default"
                >
                  <span>{SKILL_ICONS[item] || "🔹"}</span>
                  <span>{item}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
