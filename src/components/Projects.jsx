import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, ExternalLink, ShieldCheck, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../config/constants';

export default function Projects({ keyProjects, personalProjects }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract categories dynamically based on tech keywords or category tag
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    if (personalProjects) {
      personalProjects.forEach(p => {
        if (p.category) {
          cats.add(p.category);
        } else if (p.tech) {
          if (p.tech.some(t => /java|spring|kafka|mysql|redis|backend/i.test(t))) cats.add('Backend & Systems');
          if (p.tech.some(t => /react|vite|typescript|tailwind|frontend|node/i.test(t))) cats.add('Full-Stack & Tools');
        }
      });
    }
    return Array.from(cats);
  }, [personalProjects]);

  // Filter projects based on selected category tab
  const filteredPersonalProjects = useMemo(() => {
    if (!personalProjects) return [];
    if (selectedCategory === 'All') return personalProjects;
    return personalProjects.filter(p => {
      if (p.category) return p.category === selectedCategory;
      if (selectedCategory === 'Backend & Systems') {
        return p.tech && p.tech.some(t => /java|spring|kafka|mysql|redis|backend/i.test(t));
      }
      if (selectedCategory === 'Full-Stack & Tools') {
        return p.tech && p.tech.some(t => /react|vite|typescript|tailwind|frontend|node/i.test(t));
      }
      return true;
    });
  }, [personalProjects, selectedCategory]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? filteredPersonalProjects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === filteredPersonalProjects.length - 1 ? 0 : prev + 1));
  };

  const currentProject = filteredPersonalProjects[currentIndex] || filteredPersonalProjects[0];

  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      
      {/* Enterprise Company Projects Header */}
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

      {/* Enterprise Projects Grid */}
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
            className="p-6 rounded-2xl bg-[#111827]/80 border border-white/10 flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 shadow-xl backdrop-blur-md"
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

      {/* Personal Open Source Projects Interactive Carousel */}
      {personalProjects && personalProjects.length > 0 && (
        <div className="mt-20">
          
          {/* Header & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Personal & Open Source Projects
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentIndex + 1} of {filteredPersonalProjects.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-400">Interactive repository slider & engineering showcases</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter Tabs */}
              {categories.length > 1 && (
                <div className="flex items-center gap-1.5 bg-[#111827] p-1.5 rounded-xl border border-white/10">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Carousel Left / Right Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-[#111827] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-gray-300 hover:text-white transition active:scale-95 shadow-lg"
                  title="Previous Project"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-[#111827] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-gray-300 hover:text-white transition active:scale-95 shadow-lg"
                  title="Next Project"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Animated Carousel Card View */}
          {currentProject && (
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.name || currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/65 to-sky-950/65 border border-indigo-500/40 shadow-2xl relative backdrop-blur-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs font-mono text-sky-300 font-semibold">
                        Personal Project #{currentIndex + 1}
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mt-1">
                        {currentProject.name}
                      </h4>
                      <p className="text-sm text-gray-200 mt-1 mb-3">{currentProject.tagline}</p>
                      
                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {currentProject.tech && currentProject.tech.map((t, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {currentProject.isCurrentApp ? (
                        <div 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 select-none"
                          title="You are currently viewing this active portfolio!"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>Viewing Now (Active)</span>
                        </div>
                      ) : currentProject.demo ? (
                        <a 
                          href={currentProject.demo} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition shadow-md"
                          title="View Live Deployed Application"
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      ) : null}
                      {currentProject.github && (
                        <a 
                          href={currentProject.github} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                          title="View GitHub Repository"
                        >
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {currentProject.features && currentProject.features.map((feat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#111827]/80 border border-white/10 text-xs text-gray-100 flex items-start gap-2.5 shadow-md">
                        <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-normal">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Takeaways Callout */}
                  {currentProject.learning && (
                    <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-400/30 text-xs text-sky-100 flex items-start gap-2.5 shadow-lg">
                      <Zap size={16} className="text-sky-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sky-200">Key Engineering Takeaways: </span>
                        <span className="text-gray-100 leading-relaxed">{currentProject.learning}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots Pagination */}
              {filteredPersonalProjects.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {filteredPersonalProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? 'w-8 bg-sky-400 shadow-md shadow-sky-400/50'
                          : 'w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                      title={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </section>
  );
}
