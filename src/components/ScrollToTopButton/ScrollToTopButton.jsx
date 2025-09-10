import React, { useState, useEffect } from "react";
import styles from "./ScrollToTopButton.module.css";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if the user has scrolled down
  const checkScrollTop = () => {
    const deviceHeight = window.innerHeight; // Get the height of the device's viewport
    if (window.scrollY > deviceHeight / 2) {
      // 50% of the viewport height
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`${styles.scrollToTopBtn} ${isVisible ? styles.show : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <span className={styles.arrow}>↑</span>
    </button>
  );
};
