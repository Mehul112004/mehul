
import styles from './Experience.module.css';

interface ExperienceItem {
  year: string;
  company: string;
  role: string;
  details: string[];
  active?: boolean;
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    year: 'JUL 2024 — MAY 2026',
    company: 'GoHappy Club',
    role: 'Full Stack Developer',
    details: [
      'Mobile: Sole engineer — built iOS/Android app from scratch in React Native & Expo with 40+ screens, phone OTP auth, and Branch.io deep links.',
      'Backend: Sole developer — built Java Spring Boot API, coin gamification, and PhonePe subscription autopay with UPI mandates.',
      'Admin & Web: Built MUI admin portal (22+ feature pages, Tambola game board) and React web portal with Zoom redirection & early-joiner lock.'
    ],
    active: true
  },
  {
    year: 'JUN 2024 — MAY 2026',
    company: 'Dr. UPSC',
    role: 'Frontend Developer (Founding Hire)',
    details: [
      'Architecture: Sole frontend developer building Next.js web platform from scratch — 82 pages, 184 components, and 45K+ lines of code.',
      'Video & Tests: Integrated Shaka Player adaptive streaming with chat replays, and built mock test engine with question prefetching.',
      'UX: Implemented interactive themed overlays with Diwali sparklers & fireworks, and custom pichkari Holi animations.'
    ]
  },
  {
    year: '2022 — MAY 2026',
    company: 'SKIT Jaipur',
    role: 'B.Tech in Computer Science',
    details: [
      'Academics: Graduated with a CGPA of 8.48.',
      'Coursework: Data Structures & Algorithms, System Design, DBMS, Operating Systems, and Object-Oriented Programming.'
    ]
  }
];

export function Experience() {
  return (
    <section className={styles.section} id="experience">
      <div className={styles.header}>
        <span className={styles.label}>02 // CAREER_LOG</span>
        <h2 className={styles.title}>PROFESSIONAL_EXPERIENCE</h2>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.timelineLine}></div>

        {EXPERIENCE_DATA.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`${styles.timelineRow} ${!isEven ? styles.timelineRowReverse : ''}`}
            >
              {/* Year for Desktop */}
              <div 
                className={`${styles.timelineYearDesktop} ${
                  isEven ? styles.textRight : styles.textLeft
                }`}
              >
                <span className={styles.yearLabel}>{item.year}</span>
              </div>

              {/* Node Indicator */}
              <div 
                className={`${styles.node} ${
                  item.active ? styles.nodeActive : styles.nodeInactive
                }`}
              ></div>

              {/* Content Panel */}
              <div 
                className={`${styles.timelineContent} ${
                  !isEven ? styles.timelineContentReverse : ''
                }`}
              >
                {/* Year for Mobile */}
                <span className={styles.timelineYearMobile}>{item.year}</span>
                
                <h3 className={styles.companyName}>{item.company}</h3>
                <p className={styles.roleTitle}>{item.role}</p>
                
                <ul className={styles.detailList}>
                  {item.details.map((detail, detailIdx) => (
                    <li key={detailIdx}>
                      <span className={styles.bullet}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
