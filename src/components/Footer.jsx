import React from 'react';

export default function Footer({ personal }) {
  return (
    <footer className="py-6 border-t border-white/10 text-center text-xs text-gray-500 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 {personal.name}. Built with React, Framer Motion & Tailwind Aesthetics.</p>
        <div className="flex items-center gap-6">
          <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition">LinkedIn</a>
          <a href={personal.github} target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
          <a href={`mailto:${personal.email}`} className="hover:text-white transition">Email</a>
        </div>
      </div>
    </footer>
  );
}
