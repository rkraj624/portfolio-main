import React, { useState, useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const THEMES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon ⚡',
    primaryBg: '#0b061a',
    surfaceBg: '#130c29',
    cardBg: 'rgba(19, 12, 41, 0.75)',
    cardBorder: 'rgba(244, 63, 94, 0.2)',
    cardHoverBorder: 'rgba(244, 63, 94, 0.5)',
    accent1: '#f43f5e', // Neon Pink/Rose
    accent2: '#a855f7', // Neon Purple
    accent3: '#06b6d4', // Cyan
    glow1: 'rgba(244, 63, 94, 0.15)',
    glow2: 'rgba(168, 85, 247, 0.15)',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeBorder: 'rgba(244, 63, 94, 0.3)',
    badgeText: '#f43f5e',
    gradientText: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #06b6d4 100%)',
    nodeColor: 'rgba(244, 63, 94, 0.9)',
    lineColor: (dist) => `rgba(168, 85, 247, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(244, 63, 94, '
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix 🍏',
    primaryBg: '#04120c',
    surfaceBg: '#0a1f16',
    cardBg: 'rgba(10, 31, 22, 0.75)',
    cardBorder: 'rgba(16, 185, 129, 0.2)',
    cardHoverBorder: 'rgba(16, 185, 129, 0.5)',
    accent1: '#10b981', // Emerald
    accent2: '#06b6d4', // Cyan
    accent3: '#84cc16', // Lime
    glow1: 'rgba(16, 185, 129, 0.15)',
    glow2: 'rgba(6, 182, 212, 0.15)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    badgeText: '#34d399',
    gradientText: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #84cc16 100%)',
    nodeColor: 'rgba(52, 211, 153, 0.9)',
    lineColor: (dist) => `rgba(16, 185, 129, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(52, 211, 153, '
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Gold 🔥',
    primaryBg: '#170c08',
    surfaceBg: '#24140c',
    cardBg: 'rgba(36, 20, 12, 0.75)',
    cardBorder: 'rgba(249, 115, 22, 0.2)',
    cardHoverBorder: 'rgba(249, 115, 22, 0.5)',
    accent1: '#f97316', // Orange
    accent2: '#eab308', // Amber/Gold
    accent3: '#ef4444', // Red
    glow1: 'rgba(249, 115, 22, 0.15)',
    glow2: 'rgba(234, 179, 8, 0.15)',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeBorder: 'rgba(249, 115, 22, 0.3)',
    badgeText: '#fb923c',
    gradientText: 'linear-gradient(135deg, #fb923c 0%, #eab308 50%, #ef4444 100%)',
    nodeColor: 'rgba(251, 146, 60, 0.9)',
    lineColor: (dist) => `rgba(234, 179, 8, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(251, 146, 60, '
  },
  purple: {
    id: 'purple',
    name: 'Midnight Purple 🔮',
    primaryBg: '#0f0919',
    surfaceBg: '#191029',
    cardBg: 'rgba(25, 16, 41, 0.75)',
    cardBorder: 'rgba(192, 132, 252, 0.2)',
    cardHoverBorder: 'rgba(192, 132, 252, 0.5)',
    accent1: '#c084fc', // Purple
    accent2: '#818cf8', // Indigo
    accent3: '#f472b6', // Pink
    glow1: 'rgba(192, 132, 252, 0.15)',
    glow2: 'rgba(129, 140, 248, 0.15)',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    badgeBorder: 'rgba(192, 132, 252, 0.3)',
    badgeText: '#c084fc',
    gradientText: 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #f472b6 100%)',
    nodeColor: 'rgba(192, 132, 252, 0.9)',
    lineColor: (dist) => `rgba(129, 140, 248, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(192, 132, 252, '
  },
  ruby: {
    id: 'ruby',
    name: 'Crimson Ruby 💎',
    primaryBg: '#18070b',
    surfaceBg: '#270c13',
    cardBg: 'rgba(39, 12, 19, 0.75)',
    cardBorder: 'rgba(244, 63, 94, 0.2)',
    cardHoverBorder: 'rgba(244, 63, 94, 0.5)',
    accent1: '#e11d48', // Crimson Red
    accent2: '#f43f5e', // Rose
    accent3: '#fb7185', // Soft Rose
    glow1: 'rgba(225, 29, 72, 0.18)',
    glow2: 'rgba(244, 63, 94, 0.18)',
    badgeBg: 'rgba(225, 29, 72, 0.15)',
    badgeBorder: 'rgba(225, 29, 72, 0.3)',
    badgeText: '#fb7185',
    gradientText: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #fb7185 100%)',
    nodeColor: 'rgba(244, 63, 94, 0.95)',
    lineColor: (dist) => `rgba(225, 29, 72, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(251, 113, 133, '
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan 🌐',
    primaryBg: '#03141a',
    surfaceBg: '#07242e',
    cardBg: 'rgba(7, 36, 46, 0.75)',
    cardBorder: 'rgba(6, 182, 212, 0.2)',
    cardHoverBorder: 'rgba(6, 182, 212, 0.5)',
    accent1: '#06b6d4', // Cyan
    accent2: '#38bdf8', // Sky Blue
    accent3: '#22d3ee', // Bright Teal
    glow1: 'rgba(6, 182, 212, 0.18)',
    glow2: 'rgba(56, 189, 248, 0.18)',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeBorder: 'rgba(6, 182, 212, 0.3)',
    badgeText: '#22d3ee',
    gradientText: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #38bdf8 100%)',
    nodeColor: 'rgba(34, 211, 238, 0.95)',
    lineColor: (dist) => `rgba(6, 182, 212, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(34, 211, 238, '
  },
  classic: {
    id: 'classic',
    name: 'Classic Tech Blue 🔷',
    primaryBg: '#090d16',
    surfaceBg: '#111827',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.4)',
    accent1: '#38bdf8', // Sky Blue
    accent2: '#6366f1', // Indigo
    accent3: '#a855f7', // Purple
    glow1: 'rgba(99, 102, 241, 0.10)',
    glow2: 'rgba(56, 189, 248, 0.10)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeBorder: 'rgba(56, 189, 248, 0.3)',
    badgeText: '#38bdf8',
    gradientText: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%)',
    nodeColor: 'rgba(56, 189, 248, 0.9)',
    lineColor: (dist) => `rgba(99, 102, 241, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(56, 189, 248, '
  }
};

export default function ThemeSwitcher({ currentTheme, onSelectTheme }) {
  const [expanded, setExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const activeThemeConfig = THEMES[currentTheme] || THEMES.classic;
  const timeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setExpanded(true);
    }, 200); // 200ms hover entry delay before expanding
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpanded(false);
  };

  const handleThemeChange = (themeId) => {
    onSelectTheme(themeId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <div 
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-6 left-6 z-40 flex flex-col-reverse gap-2 items-start"
    >
      <div className="bg-[#111827]/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-1.5 flex flex-col-reverse items-center gap-2">
        {/* Toggle Button - Minimalist Icon Only */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition border border-white/10 shadow-lg select-none cursor-pointer"
          title="Color Themes"
        >
          <Palette size={18} className="text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
        </button>

        {/* Clean, Elegant Vertical Popover along Y-Axis */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-2 overflow-hidden pb-1 border-b border-white/10 w-full"
            >
              {Object.values(THEMES).map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-150 relative group hover:scale-125 ${
                      isSelected 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#090d16] scale-110 shadow-lg' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: theme.gradientText
                    }}
                    title={theme.name}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white shadow-md animate-ping absolute" />
                    )}
                    <span className="text-[10px] font-bold text-white shadow-sm pointer-events-none">
                      {theme.id === 'cyberpunk' ? '⚡' : theme.id === 'emerald' ? '🍏' : theme.id === 'sunset' ? '🔥' : theme.id === 'purple' ? '🔮' : theme.id === 'ruby' ? '💎' : theme.id === 'cyan' ? '🌐' : '🔷'}
                    </span>

                    {/* Floating Tooltip to the Right */}
                    <div className="absolute left-full ml-3 hidden group-hover:block bg-[#111827] text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/15 whitespace-nowrap shadow-xl z-50 pointer-events-none">
                      {theme.name}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification on Theme Switch */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-2"
            style={{ background: activeThemeConfig.gradientText }}
          >
            <span>✨ Theme Applied: {activeThemeConfig.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
