import React from "react";
import styles from "./Education.module.css";
import educationData from "../../data/education.json"; // Adjust the path as needed

export const Education = () => {
  return (
    <section className={styles.container} id="education">
      <h2 className={styles.title}>Education</h2>
      <div className={styles.content}>
        {educationData.map((item, index) => (
          <div className={styles.educationBlock}>
            <div className={styles.educationHeader}>
              <h3 className={styles.educationDegree}>
                {item.degree}{" "}
                <span className={styles.educationDetails}>{item.details}</span>
              </h3>
              {item.duration && (
                <span className={styles.educationDuration}>
                  {item.duration}
                </span>
              )}
            </div>
            <p className={styles.educationInfo}>
              {item.institute && (
                <>
                  <strong></strong> {item.institute} <br />
                </>
              )}
              {item.branch && (
                <>
                  <strong>Branch:</strong> {item.branch} <br />
                </>
              )}
              {item.school && (
                <>
                  <strong>School:</strong> {item.school}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
