
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <span className={styles.status}>Status: Operational</span>
        
        <h1 className={styles.title}>
          SYSTEM ARCHITECT & <br />FULL STACK ENGINEER
        </h1>
        
        <p className={styles.description}>
          &gt; engineering mission-critical systems with mathematical precision and structural integrity. specializing in high-performance backends and low-latency architectures.
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
