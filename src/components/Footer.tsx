
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.logo}>MEHUL</div>
      
      <div className={styles.copyright}>
        © 2026 MEHUL — BUILT FOR PERFORMANCE
      </div>
      
      <div className={styles.links}>
        <a className={styles.link} href="https://github.com/Mehul112004" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <a className={styles.link} href="https://linkedin.com/in/mehul112004" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        <a className={styles.link} href="https://github.com/Mehul112004/mehul" target="_blank" rel="noopener noreferrer">SOURCE</a>
      </div>
    </footer>
  );
}
