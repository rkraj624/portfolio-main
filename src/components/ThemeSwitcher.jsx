import React, { useState, useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const THEMES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon ⚡',
    primaryBg: '#0d061f',
    surfaceBg: '#170c36',
    cardBg: 'rgba(23, 12, 54, 0.88)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    cardHoverBorder: 'rgba(244, 63, 94, 0.6)',
    accent1: '#f43f5e', // Neon Pink/Rose
    accent2: '#a855f7', // Neon Purple
    accent3: '#06b6d4', // Cyan
    glow1: 'rgba(244, 63, 94, 0.38)',
    glow2: 'rgba(168, 85, 247, 0.38)',
    badgeBg: 'rgba(244, 63, 94, 0.22)',
    badgeBorder: 'rgba(244, 63, 94, 0.45)',
    badgeText: '#f43f5e',
    gradientText: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #06b6d4 100%)',
    nodeColor: 'rgba(244, 63, 94, 0.85)',
    lineColor: (dist) => `rgba(168, 85, 247, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(244, 63, 94, '
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix 🍏',
    primaryBg: '#03170e',
    surfaceBg: '#092618',
    cardBg: 'rgba(9, 38, 24, 0.88)',
    cardBorder: 'rgba(16, 185, 129, 0.3)',
    cardHoverBorder: 'rgba(16, 185, 129, 0.6)',
    accent1: '#10b981', // Emerald
    accent2: '#06b6d4', // Cyan
    accent3: '#84cc16', // Lime
    glow1: 'rgba(16, 185, 129, 0.38)',
    glow2: 'rgba(6, 182, 212, 0.38)',
    badgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeBorder: 'rgba(16, 185, 129, 0.45)',
    badgeText: '#34d399',
    gradientText: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #84cc16 100%)',
    nodeColor: 'rgba(52, 211, 153, 0.85)',
    lineColor: (dist) => `rgba(16, 185, 129, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(52, 211, 153, '
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Gold 🔥',
    primaryBg: '#1c0c06',
    surfaceBg: '#2d140a',
    cardBg: 'rgba(45, 20, 10, 0.88)',
    cardBorder: 'rgba(249, 115, 22, 0.3)',
    cardHoverBorder: 'rgba(249, 115, 22, 0.6)',
    accent1: '#f97316', // Orange
    accent2: '#eab308', // Amber/Gold
    accent3: '#ef4444', // Red
    glow1: 'rgba(249, 115, 22, 0.38)',
    glow2: 'rgba(234, 179, 8, 0.38)',
    badgeBg: 'rgba(249, 115, 22, 0.22)',
    badgeBorder: 'rgba(249, 115, 22, 0.45)',
    badgeText: '#fb923c',
    gradientText: 'linear-gradient(135deg, #fb923c 0%, #eab308 50%, #ef4444 100%)',
    nodeColor: 'rgba(251, 146, 60, 0.85)',
    lineColor: (dist) => `rgba(234, 179, 8, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(251, 146, 60, '
  },
  purple: {
    id: 'purple',
    name: 'Midnight Purple 🔮',
    primaryBg: '#120a21',
    surfaceBg: '#1d1133',
    cardBg: 'rgba(29, 17, 51, 0.88)',
    cardBorder: 'rgba(192, 132, 252, 0.3)',
    cardHoverBorder: 'rgba(192, 132, 252, 0.6)',
    accent1: '#c084fc', // Purple
    accent2: '#818cf8', // Indigo
    accent3: '#f472b6', // Pink
    glow1: 'rgba(192, 132, 252, 0.38)',
    glow2: 'rgba(129, 140, 248, 0.38)',
    badgeBg: 'rgba(192, 132, 252, 0.22)',
    badgeBorder: 'rgba(192, 132, 252, 0.45)',
    badgeText: '#c084fc',
    gradientText: 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #f472b6 100%)',
    nodeColor: 'rgba(192, 132, 252, 0.85)',
    lineColor: (dist) => `rgba(129, 140, 248, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(192, 132, 252, '
  },
  ruby: {
    id: 'ruby',
    name: 'Crimson Ruby 💎',
    primaryBg: '#1e080e',
    surfaceBg: '#300d17',
    cardBg: 'rgba(48, 13, 23, 0.88)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    cardHoverBorder: 'rgba(244, 63, 94, 0.6)',
    accent1: '#e11d48', // Crimson Red
    accent2: '#f43f5e', // Rose
    accent3: '#fb7185', // Soft Rose
    glow1: 'rgba(225, 29, 72, 0.40)',
    glow2: 'rgba(244, 63, 94, 0.40)',
    badgeBg: 'rgba(225, 29, 72, 0.22)',
    badgeBorder: 'rgba(225, 29, 72, 0.45)',
    badgeText: '#fb7185',
    gradientText: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #fb7185 100%)',
    nodeColor: 'rgba(244, 63, 94, 0.85)',
    lineColor: (dist) => `rgba(225, 29, 72, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(251, 113, 133, '
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan 🌐',
    primaryBg: '#031a24',
    surfaceBg: '#072b3a',
    cardBg: 'rgba(7, 43, 58, 0.88)',
    cardBorder: 'rgba(6, 182, 212, 0.3)',
    cardHoverBorder: 'rgba(6, 182, 212, 0.6)',
    accent1: '#06b6d4', // Cyan
    accent2: '#38bdf8', // Sky Blue
    accent3: '#22d3ee', // Bright Teal
    glow1: 'rgba(6, 182, 212, 0.40)',
    glow2: 'rgba(56, 189, 248, 0.40)',
    badgeBg: 'rgba(6, 182, 212, 0.22)',
    badgeBorder: 'rgba(6, 182, 212, 0.45)',
    badgeText: '#22d3ee',
    gradientText: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #38bdf8 100%)',
    nodeColor: 'rgba(34, 211, 238, 0.85)',
    lineColor: (dist) => `rgba(6, 182, 212, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(34, 211, 238, '
  },
  classic: {
    id: 'classic',
    name: 'Classic Tech Blue 🔷',
    primaryBg: '#090d16',
    surfaceBg: '#111827',
    cardBg: 'rgba(17, 24, 39, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.5)',
    accent1: '#38bdf8', // Sky Blue
    accent2: '#6366f1', // Indigo
    accent3: '#a855f7', // Purple
    glow1: 'rgba(99, 102, 241, 0.35)',
    glow2: 'rgba(56, 189, 248, 0.35)',
    badgeBg: 'rgba(56, 189, 248, 0.22)',
    badgeBorder: 'rgba(56, 189, 248, 0.45)',
    badgeText: '#38bdf8',
    gradientText: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%)',
    nodeColor: 'rgba(56, 189, 248, 0.85)',
    lineColor: (dist) => `rgba(99, 102, 241, ${0.45 * (1 - dist / 170)})`,
    textColor: 'rgba(56, 189, 248, '
  }
};

export const generateCustomTheme = (colorHex = '#06b6d4') => {
  let hex = colorHex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) || 6;
  const g = parseInt(hex.substring(2, 4), 16) || 182;
  const b = parseInt(hex.substring(4, 6), 16) || 212;

  const darkR = Math.max(2, Math.floor(r * 0.07));
  const darkG = Math.max(6, Math.floor(g * 0.07));
  const darkB = Math.max(12, Math.floor(b * 0.07));
  const primaryBg = `rgb(${darkR}, ${darkG}, ${darkB})`;

  const cardR = Math.max(12, Math.floor(r * 0.15));
  const cardG = Math.max(20, Math.floor(g * 0.15));
  const cardB = Math.max(30, Math.floor(b * 0.15));
  const cardBg = `rgba(${cardR}, ${cardG}, ${cardB}, 0.88)`;

  return {
    id: 'custom',
    name: `Custom Color 🎨 (${colorHex})`,
    primaryBg: primaryBg,
    surfaceBg: `rgb(${cardR}, ${cardG}, ${cardB})`,
    cardBg: cardBg,
    cardBorder: `rgba(${r}, ${g}, ${b}, 0.35)`,
    cardHoverBorder: `rgba(${r}, ${g}, ${b}, 0.65)`,
    accent1: colorHex,
    accent2: `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 50)})`,
    accent3: `rgb(${Math.min(255, r - 20)}, ${Math.min(255, g + 40)}, ${Math.min(255, b - 10)})`,
    glow1: `rgba(${r}, ${g}, ${b}, 0.38)`,
    glow2: `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 60)}, 0.38)`,
    badgeBg: `rgba(${r}, ${g}, ${b}, 0.22)`,
    badgeBorder: `rgba(${r}, ${g}, ${b}, 0.45)`,
    badgeText: colorHex,
    gradientText: `linear-gradient(135deg, ${colorHex} 0%, rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 60)}) 100%)`,
    nodeColor: `rgba(${r}, ${g}, ${b}, 0.85)`,
    lineColor: (dist) => `rgba(${r}, ${g}, ${b}, ${0.45 * (1 - dist / 170)})`,
    textColor: `rgba(${r}, ${g}, ${b}, `
  };
};

export default function ThemeSwitcher({ currentTheme, customColor = '#06b6d4', onSelectTheme }) {
  const [expanded, setExpanded] = useState(false);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isHoveredRef = React.useRef(false);
  const dockRef = React.useRef(null);
  const timeoutRef = React.useRef(null);

  const customThemeObj = generateCustomTheme(customColor);
  const activeThemeConfig = currentTheme === 'custom' 
    ? customThemeObj 
    : (THEMES[currentTheme] || THEMES.classic);

  // Outside click listener as fallback
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dockRef.current && !dockRef.current.contains(event.target) && !isPickingColor) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPickingColor]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPickingColor) return; // Stay open while native color picker is active
    
    timeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isPickingColor) {
        setExpanded(false);
      }
    }, 200); // 200ms auto-close delay when cursor leaves dock
  };

  const handleThemeChange = (themeId, hexColor) => {
    onSelectTheme(themeId, hexColor);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleCustomColorInput = (e) => {
    const val = e.target.value;
    handleThemeChange('custom', val);
  };

  return (
    <div 
      ref={dockRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
              {/* Preset Themes List */}
              {Object.values(THEMES).map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setIsPickingColor(false);
                      handleThemeChange(theme.id);
                    }}
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

              {/* Custom Color Selector Button */}
              <div 
                onClick={() => setIsPickingColor(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-150 relative group hover:scale-125 cursor-pointer mt-1 border border-white/20 shadow-md overflow-hidden"
                style={{
                  background: customThemeObj.gradientText
                }}
                title="Custom Color Picker 🎨"
              >
                <input 
                  type="color" 
                  value={customColor}
                  onFocus={() => setIsPickingColor(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPickingColor(true);
                  }}
                  onChange={(e) => {
                    setIsPickingColor(true);
                    handleCustomColorInput(e);
                  }}
                  onBlur={() => {
                    setIsPickingColor(false);
                    if (!isHoveredRef.current) {
                      timeoutRef.current = setTimeout(() => {
                        if (!isHoveredRef.current) {
                          setExpanded(false);
                        }
                      }, 200);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Pick your custom theme color"
                />
                {currentTheme === 'custom' && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-md animate-ping absolute" />
                )}
                <span className="text-xs font-bold text-white shadow-sm pointer-events-none z-0">🎨</span>

                {/* Tooltip to the Right */}
                <div className="absolute left-full ml-3 hidden group-hover:block bg-[#111827] text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/15 whitespace-nowrap shadow-xl z-50 pointer-events-none">
                  Custom Color 🎨 ({customColor})
                </div>
              </div>
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
