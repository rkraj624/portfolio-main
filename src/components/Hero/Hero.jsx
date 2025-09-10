import "react";
import { getImageUrl } from "../../utils";
import styles from "./Hero.module.css";
import { ReactTyped } from "react-typed";
import socialLinks from "../../data/socialLinks.json";

export const Hero = () => {
  const roles = ["Senior Software Engineer"];
  const cursorStyle = {
    fontWeight: "bold",
    color: "white",
    display: "inline-block",
    fontSize: "1.5rem",
    letterSpacing: "0.1rem",
    // textShadow: "0 0 10px rgba(255, 87, 51, 0.8)", // Glow effect
    fontFamily: "'Caveat'",
    fontStyle: "italic",
  };

  return (
    <section className={styles.container} id="home">
      <div className={styles.content}>
        <span className={styles.title}>Hello I&apos;m</span>
        <h1 className={styles.name}>Ravi Kishan Raj</h1>
        <div>
          <p className="roleClass">
            <ReactTyped
              strings={roles}
              typeSpeed={100}
              loop
              backSpeed={60}
              // cursorChar="|"
              showCursor={false}
              style={cursorStyle}
            />
            <span className={styles.cursor}>&nbsp;</span>
          </p>
        </div>

        <div className={styles.contactInfo}>
          <div>
            <img src={getImageUrl(`/skills/svg/envelope.svg`)} />
            <a href="mailto:iamravikishanraj@gmail.com">
              iamravikishanraj@gmail.com
            </a>
          </div>
          <div>
            <img src={getImageUrl(`/skills/svg/phone.svg`)} />
            <a href="tel:+916302028752">+91 630 202 8752</a>
          </div>
          <div>
            <img src={getImageUrl(`/skills/svg/location.svg`)} />
            <a href="https://www.google.com/maps/place/Gurugram" target="_blank">
              Gurgaon
            </a>
          </div>
        </div>
        <i className="fa fa-linkedin-square"></i>

        <div className={styles.socialMediaIcons}>
          {socialLinks.map((media, index) => (
            <div key={index}>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${media.platform}`}
              >
                <img
                  src={getImageUrl(
                    `/skills/svg/mediaIcons/${media.platform
                      .toLowerCase()
                      .replace(/\s+/g, "")}.svg`
                  )}
                  alt={media.platform}
                  className={styles.socialMediaIcon}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.heroImgDiv}>
        <div>
          <div>
            <img
              src={getImageUrl("hero/Profile.jpeg")}
              alt="Profile Pic"
              className={styles.heroImg}
            />
          </div>
        </div>
      </div>
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
