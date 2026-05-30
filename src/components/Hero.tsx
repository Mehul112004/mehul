
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <span className={styles.status}>Status: Operational</span>
        
        <h1 className={styles.title}>
          MOBILE & <br />FULL STACK DEVELOPER
        </h1>
        
        <p className={styles.description}>
          &gt; engineering robust mobile applications and scalable backend architectures. specializing in react native, next.js, and spring boot with a track record of building and scaling platforms to serve over 30,000 active users.
        </p>
        
        <div className={styles.ctaContainer}>
          <a href="#projects" className={styles.ctaButton}>
            VIEW_REPOSITORIES
          </a>
        </div>
      </div>
    </section>
  );
}
