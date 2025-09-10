import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import { ThemeToggleButton } from "../ThemeToggleButton/ThemeToggleButton";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false); // Track if the user has scrolled
  const [activeSection, setActiveSection] = useState(""); // Track the active section

  const menuRef = useRef(null); // Reference to the menu container
  const sections = [
    "home",
    "about",
    "experience",
    "skills",
    "projects",
    "education",
    "contact",
  ]; // IDs of sections

  // Update scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Toggle scrolled state when user scrolls past a certain point (e.g., 50px)
      if (winScroll > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine which section is active
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActiveSection(section);
          }
        }
      });
    };

    const handleClickOutside = (event) => {
      // Close the menu if clicking outside of it
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sections]);

  return (
    <nav
      className={`${styles.navbar} ${scrolled && !menuOpen ? styles.scrolled : ""}`}
    >
      {/* Scroll Progress Bar */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }} // Dynamically update width based on scroll progress
        />
      </div>
      <a href="/" className={styles.title}>
        Portfolio
      </a>
      <div className={styles.menu} ref={menuRef}>
        <div
          className={`${styles.nav__toggler} ${
            menuOpen ? styles.toggleIcon : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={styles.one}></div>
          <div className={styles.two}></div>
          <div className={styles.three}></div>
        </div>
        <ul
          className={`${styles.menuItems} ${
            menuOpen ? styles.menuOpen : styles.menuClose
          }`}
        >
          {sections.map((section) => (
            <li
              key={section}
              className={activeSection === section ? styles.active : ""}
              onClick={() => setMenuOpen(false)} // Close menu when clicking an item
            >
              <a href={`#${section}`}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </li>
          ))}
          <ThemeToggleButton/>
        </ul>
      </div>
    </nav>
  );
};
