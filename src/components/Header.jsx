import React, { useState } from 'react';
import { FileDown, Menu, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Header({ personal, scrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-4 ${scrolled ? 'bg-[#090d16]/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-white hover:opacity-80 transition">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-sm shadow-md shadow-indigo-500/20">RR</span>
          <span>Ravi<span className="text-sky-400">.java</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
          <a href="#about" className="hover:text-sky-400 transition">About</a>
          <a href="#experience" className="hover:text-sky-400 transition">Experience</a>
          <a href="#projects" className="hover:text-sky-400 transition">Projects</a>
          <a href="#skills" className="hover:text-sky-400 transition">Skills</a>
          <a href="#achievements" className="hover:text-sky-400 transition">Achievements</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a 
            href={personal.resumeUrl} 
            download 
            onClick={triggerConfetti}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileDown size={16} /> Resume
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-white/10 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#achievements" onClick={() => setMobileMenuOpen(false)}>Achievements</a>
          <a 
            href={personal.resumeUrl} 
            download 
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold"
          >
            <FileDown size={16} /> Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
