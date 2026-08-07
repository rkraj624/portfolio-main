import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ChevronRight } from 'lucide-react';
import { fadeInUp } from '../config/constants';

export default function CustomSections({ customSections }) {
  if (!customSections || customSections.length === 0) return null;

  return (
    <>
      {customSections.map((sec, idx) => (
        <section key={sec.id || idx} id={sec.id || `custom-${idx}`} className="py-20 px-6 max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-sky-400 border border-indigo-500/20 text-xl">
              {sec.icon || "✨"}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{sec.title}</h2>
              {sec.subtitle && <p className="text-sm text-gray-400">{sec.subtitle}</p>}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sec.items && sec.items.map((item, i) => (
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeInUp}
                whileHover={{ translateY: -4 }}
                key={i} 
                className="p-6 rounded-2xl bg-[#111827]/60 border border-white/10 hover:border-sky-500/40 transition duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  {item.subtitle && <div className="text-xs font-mono text-sky-400 mb-3">{item.subtitle}</div>}
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">{item.description}</p>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
