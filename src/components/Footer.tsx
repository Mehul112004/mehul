import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          <div className={styles.logoContainer}>
            <span className={styles.logo}>MEHUL</span>
            <span className={styles.logoDot} />
          </div>
          <p className={styles.tagline}>
            Designing & engineering high-performance, visually stunning web and mobile interfaces with a focus on clean code and robust architecture.
          </p>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>CONNECT</span>
            <a
              className={styles.link}
              href="https://github.com/Mehul112004"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`material-symbols-outlined ${styles.linkIcon}`}>
                terminal
              </span>
              GITHUB
            </a>
            <a
              className={styles.link}
              href="https://linkedin.com/in/mehul112004"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`material-symbols-outlined ${styles.linkIcon}`}>
                work
              </span>
              LINKEDIN
            </a>
          </div>

          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>CONTACT</span>
            <a className={styles.link} href="mailto:mehulbohra11@gmail.com">
              <span className={`material-symbols-outlined ${styles.linkIcon}`}>
                mail
              </span>
              mehulbohra11@gmail.com
            </a>
            <a className={styles.link} href="tel:+919784765335">
              <span className={`material-symbols-outlined ${styles.linkIcon}`}>
                call
              </span>
              +91 97847 65335
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © 2026 MEHUL. All rights reserved.
        </div>
        <div className={styles.statusIndicator}>
          <span className={styles.statusText}>NEURAL_FABRIC // ONLINE</span>
          <span className={styles.statusDot} />
        </div>
      </div>
    </footer>
  );
}

