import React from "react";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";
import styles from "./Experience.module.css";

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
        <ul className={styles.history}>
          {history.map((historyItem, id) => {
            return (
              <li key={id} className={styles.historyItem}>
                <div className={styles.historyItemLeft}>
                  <div className={styles.companyInfo}>
                    <img
                      src={getImageUrl(historyItem.imageSrc)}
                      alt={historyItem.organisation}
                      className={styles.companyIcon}
                    />
                    <h3 className={styles.companyName}>
                      {historyItem.organisation}
                    </h3>
                  </div>
                  {/* <h3 className={styles.position}>{historyItem.role}</h3> */}
                  <p
                    className={styles.date}
                  >{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                </div>
                <div className={styles.historyItemRight}>
                  <h3 className={styles.position}>{historyItem.role}</h3>

                  {/* <p className={styles.date}>{`${historyItem.startDate} - ${historyItem.endDate}`}</p> */}
                  <ul className={styles.experiencePoints}>
                    {historyItem.experiences.map((experience, id) => {
                      return <li key={id}>{experience}</li>;
                    })}
                  </ul>
                  <div className={styles.techContainer}>
                    {historyItem.techUsed.map((tech, techIndex) => (
                      <span key={techIndex} className={styles.techUsed}>
                        <img
                          src={getImageUrl(`/skills/svg/${tech.toLowerCase().replace(/\s+/g, '')}.svg`)}
                          alt={tech}
                          className={styles.techIcon}
                        />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
