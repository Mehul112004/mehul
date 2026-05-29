
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.logo}>ARCHITECT.IO</div>
      
      <div className={styles.copyright}>
        © 2024 ARCHITECT.IO — BUILT FOR PERFORMANCE
      </div>
      
      <div className={styles.links}>
        <a className={styles.link} href="#" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <a className={styles.link} href="#" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        <a className={styles.link} href="#" target="_blank" rel="noopener noreferrer">SOURCE</a>
      </div>
    </footer>
  );
}
