import  { useState } from "react";
import contactData from "../../data/contact.json";
import formFields from "../../data/formFields.json";
import styles from "./ContactMe.module.css";

import emailjs from "@emailjs/browser";

export const ContactMe = () => {
  const [formData, setFormData] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    console.log('Id' + JSON.stringify(import.meta.env.VITE_APP_EMAILJS_SERVICE_ID));
    emailjs
      .sendForm(import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID, e.target, {
        publicKey: import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          setStatusMessage('Email sent successfully!');
          setStatusMessageClass(styles.successMessage); // Apply success styling
          console.log('SUCCESS!');
          setFormData({});
          e.target.reset();
          setTimeout(() => {
            setStatusMessage("");
            setStatusMessageClass(""); 
          }, 3000);
        },
        (error) => {
          setStatusMessage(`Failed to send email: ${error.text}`);
          setStatusMessageClass(styles.errorMessage); // Apply error styling
          console.log('FAILED...', error.text);
          setTimeout(() => {
            setStatusMessage("");
            setStatusMessageClass(""); 
          }, 3000);
        }
      );
  };
  const [statusMessageClass, setStatusMessageClass] = useState("");

  return (
    <footer className={styles.container} id="contact">
      <h2 className={styles.title}>Contact</h2>
      <div className={styles.content}>
        <div className={styles.contactDatas}>
          {contactData.map((item, index) => {
            return (
              <div className={styles.contactData}>
                <div className={styles.contactImgOuter}>
                  <div className={styles.contactImgInner}>
                    <i className={item.iconClass}></i>
                  </div>
                </div>
                <div className={styles.contactDataDetails}>
                  <h4 className={styles.contactDataTitle}>{item.type}</h4>
                  <div className={styles.contactDataValues}>
                    {item.values.map((value, idx) => {
                      return <p>{value}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.contactFormMap}>
          <div className={styles.contactFormDiv}>
            <form
              onSubmit={sendEmail}
              autoComplete="off"
              className={styles.contactForm}
            >
              {formFields.map((field, index) => (
                <div key={index} className={styles.formField}>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      className={styles.fieldTextArea}
                      required={field.required}
                      onChange={handleChange}
                      placeholder={field.label}
                    ></textarea>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      className={styles.fieldInput}
                      required={field.required}
                      onChange={handleChange}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
              <button type="submit" className={styles.btn}>
                <i
                  id="send_text"
                  style={{ display: "none", fontStyle: "normal" }}
                >
                  Send
                </i>
                <i className="fa" id="send_icon">
                  &#xf1d8;
                </i>
              </button>
            </form>
            {statusMessage && (
              <div className={statusMessageClass}>
                {statusMessage}
              </div>
            )}
          </div>
          <div>
            <iframe
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=gurgaon&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              className={styles.map}
            ></iframe>
          </div>
        </div>
        <div className={styles.copyRight}>
          © Copyright. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
