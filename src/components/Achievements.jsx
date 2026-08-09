import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Sparkles } from 'lucide-react';
import { fadeInUp } from '../config/constants';
import Tilt3DCard from './Tilt3DCard';

export default function Achievements({ achievements, education }) {
  return (
    <section id="achievements" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Achievements */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.15 }} 
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Honors & Awards</h2>
              <p className="text-xs text-gray-400">Recognition for engineering impact</p>
            </div>
          </div>

          <div className="space-y-4">
            {achievements.map((item, idx) => (
              <Tilt3DCard key={idx}>
                <div className="p-5 rounded-xl bg-[#111827]/60 border border-white/10 flex items-start gap-4 transition duration-300 hover:border-amber-500/40 shadow-xl">
                  <Sparkles size={20} className="text-amber-400 shrink-0 mt-1" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <span className="text-xs font-mono text-gray-400">{item.date}</span>
                    </div>
                    <p className="text-xs text-sky-400 mt-0.5">{item.issuer}</p>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.15 }} 
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Education</h2>
              <p className="text-xs text-gray-400">Academic background</p>
            </div>
          </div>

          <Tilt3DCard>
            <div className="p-6 rounded-2xl bg-[#111827]/60 border border-white/10 relative hover:border-emerald-500/40 transition duration-300 shadow-xl">
              <h3 className="text-lg font-bold text-white">{education.institution}</h3>
              <p className="text-sm text-sky-400 font-medium">{education.degree}</p>
              <p className="text-xs text-gray-400 mt-1">{education.location} • {education.period}</p>
              
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">Cumulative GPA:</span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {education.gpa}
                </span>
              </div>
            </div>
          </Tilt3DCard>
        </motion.div>

      </div>
    </section>
  );
}
