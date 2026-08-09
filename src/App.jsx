import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import CustomSections from './components/CustomSections';
import Achievements from './components/Achievements';
import Footer from './components/Footer';
import AdminDashboard from './admin/AdminDashboard';
import TechBackground from './components/TechBackground';
import TechLoader from './components/TechLoader';
import AudioIntroduction from './components/AudioIntroduction';

import { PORTFOLIO_DATA } from './data';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Single source of truth from src/data.js
  const [portfolioData, setPortfolioData] = useState(PORTFOLIO_DATA);

  const { personal, summary, skills, experience, keyProjects, personalProjects, achievements, education } = portfolioData;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handlePopState);
    
    // Track pageview metric
    try {
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pageview' })
      }).catch(() => {});
    } catch (e) {}

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleUpdateData = (newData) => {
    setPortfolioData(newData);
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route: /dashboard
  if (currentPath === '/dashboard') {
    return (
      <AdminDashboard 
        data={portfolioData} 
        onUpdateData={handleUpdateData} 
        onClose={() => navigateTo('/')} 
      />
    );
  }

  // Default Route: /
  return (
    <div className="min-h-screen bg-[#090d16] text-[#f3f4f6] font-sans relative selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Permanent Static Ambient Glows & Interactive Tech Canvas Background */}
      <TechBackground />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Intro System Boot Tech Loader with AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading && <TechLoader key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Portfolio Content Revealed with Simultaneous Cross-Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className={isLoading ? "pointer-events-none" : ""}
      >
        {/* Main Layout Sections */}
        <Header personal={personal} scrolled={scrolled} />
        
        <main className="relative z-10">
          <Hero personal={personal} summary={summary} />
          <Experience experience={experience} />
          <Projects keyProjects={keyProjects} personalProjects={personalProjects} />
          <Skills skills={skills} />
          <CustomSections customSections={portfolioData.customSections} />
          <Achievements achievements={achievements} education={education} />
        </main>

        {/* Floating Audio Introduction Player */}
        <AudioIntroduction personal={personal} />

        <Footer personal={personal} />
      </motion.div>

      {/* Vercel Web Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />

    </div>
  );
}
