import styles from "./App.module.css";
import { About } from "./components/About/About";
import { ContactMe } from "./components/ContactMe/ContactMe";
import { Education } from "./components/Education/Education";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";
import { ScrollToTopButton } from "./components/ScrollToTopButton/ScrollToTopButton";
import { Skills } from "./components/Skills/Skills";
import { ThemeToggleButton } from "./components/ThemeToggleButton/ThemeToggleButton";

function App() {
  return (
    <div className={styles.App}>
      
      <Navbar/>
      <Hero/>
      <About/>
      <Experience/>
      <Skills/>
      <Projects/>
      <Education/>
      <ContactMe/>
      <ScrollToTopButton/>
    </div>
  );
}

export default App;
