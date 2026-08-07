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

import { PORTFOLIO_DATA } from './data';
import './index.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // LocalStorage state persistence for live editing
  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = localStorage.getItem('ravi_portfolio_data');
    return saved ? JSON.parse(saved) : PORTFOLIO_DATA;
  });

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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleUpdateData = (newData) => {
    setPortfolioData(newData);
    localStorage.setItem('ravi_portfolio_data', JSON.stringify(newData));
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
      
      {/* Intro System Boot Tech Loader with AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading && <TechLoader key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Portfolio Content Revealed with Smooth Motion Animation */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {/* Interactive Tech Matrix & Microservices Mesh Canvas Background */}
          <TechBackground />

          {/* Background Ambient Glows */}
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

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

          <Footer personal={personal} />
        </motion.div>
      )}

    </div>
  );
}
