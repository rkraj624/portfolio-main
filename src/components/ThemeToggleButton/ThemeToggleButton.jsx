import { useState, useEffect } from 'react';
import styles from './ThemeToggleButton.module.css'; // Importing CSS module

export const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mode, setMode] = useState("Light");

  // Toggle the theme between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply the theme to the root element
  useEffect(() => {
    if (isDarkMode) {
      setMode("Light");
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setMode("Dark");
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  return (
    <>
    <h2 className="" style={{cursor:"pointer"}}  onClick={toggleTheme} >{mode}</h2>
    </>
  );
};
 