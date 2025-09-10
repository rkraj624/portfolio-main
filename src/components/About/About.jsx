import React from "react";
import { getImageUrl } from "../../utils";
import styles from "./About.module.css";

export const About = () => {
  return (
    <section className={styles.container} id="about">
      <h2 className={styles.title}>About</h2>
      <div className={styles.content}>
        <img
          src={getImageUrl("skills/svg/developer.svg")}
          alt="Me sitting with a laptop"
          className={styles.aboutImage}
        />
        <ul className={styles.aboutItems}>
          <li  className={styles.aboutItem}>
            <img src={getImageUrl("about/serverIcon.png")} alt="cursor" />
            <div>
              <h3>Backend Developer</h3>
              <p>
              I&apos;am a Java Backend Developer with 2.8 years of hands-on experience in building scalable and efficient backend systems. I specialize in modernizing legacy applications, optimizing APIs, and leveraging cutting-edge technologies to deliver high-performance solutions.
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/cursorIcon.png")} alt="cursor" />
            <div >
              <h3>Creative</h3>
              <p>
              I’m also a Frontend Developer skilled in building responsive, dynamic user interfaces with React, HTML, CSS, and JavaScript.
              </p>
            </div>
          </li>
          <li  className={styles.aboutItem}>
            <img src={getImageUrl("about/uiIcon.png")} alt="cursor" />
            <div>
              <h3>UI Designer</h3>
              <p>
              I’m passionate about UI Design, creating clean and intuitive user interfaces that enhance the user experience while aligning with technical requirements.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
