import React, { useState } from "react";
import { getImageUrl } from "../../utils";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ project }) => {
  const [showAll, setShowAll] = useState(false);
  

  const toggleReadMore = () => setShowAll(!showAll);

  return (
    <div className={styles.container}>
      <img
        src={getImageUrl(project.imageSrc)}
        alt={`Image of ${project.title}`}
        className={styles.image}
      />
      <h3 className={styles.title}>{project.title}</h3>
      <div className={styles.description}>
        <ul>
          {project.description
            .slice(0, showAll ? project.description.length : 2)
            .map((point, id1) => (
              <li key={id1}>{point}</li>
            ))}
        </ul>
        {project.description.length > 2 && (
          <button onClick={toggleReadMore} className={styles.readMore}>
            {showAll ? "read less...." : "....read more"}
          </button>
        )}
      </div>
      <div className={styles.techContainer}>
        {project.techUsed.map((tech, techIndex) => (
          <span key={techIndex} className={styles.techUsed}>
            <img
              src={getImageUrl(
                `/skills/svg/${tech.toLowerCase().replace(/\s+/g, "")}.svg`
              )}
              alt={tech}
              className={styles.techIcon}
            />
            {tech}
          </span>
        ))}
      </div>
      <div className={styles.links}>
          {Object.entries(project.links).map(([key, url]) => (
            url ? (
              <a key={key} href={url} className={styles.link}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the link text */}
              </a>
            ) : null // Don't render link if url is null
          ))}
        </div>
    </div>
  );
};
