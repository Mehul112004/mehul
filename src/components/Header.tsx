import { useEffect, useState } from 'react';
import styles from './Header.module.css';

export function Header() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'experience', 'stack', 'contact'];
      let current = '';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is near or above the viewport, mark it active
          if (rect.top <= 120) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>ARCHITECT.IO</a>
      
      <nav className={styles.nav}>
        <a 
          href="#projects" 
          className={`${styles.navLink} ${activeSection === 'projects' ? styles.activeNavLink : ''}`}
        >
          PROJECTS
        </a>
        <a 
          href="#experience" 
          className={`${styles.navLink} ${activeSection === 'experience' ? styles.activeNavLink : ''}`}
        >
          EXPERIENCE
        </a>
        <a 
          href="#stack" 
          className={`${styles.navLink} ${activeSection === 'stack' ? styles.activeNavLink : ''}`}
        >
          STACK
        </a>
        <a 
          href="#contact" 
          className={`${styles.navLink} ${activeSection === 'contact' ? styles.activeNavLink : ''}`}
        >
          CONTACT
        </a>
      </nav>
      
      <button className={styles.resumeBtn}>RESUME</button>
    </header>
  );
}
