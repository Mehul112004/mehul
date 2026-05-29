
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
    year: '2023 — PRESENT',
    company: 'GoHappy Club',
    role: 'Senior Full Stack Architect',
    details: [
      'Scaled real-time engagement engine to 100k+ concurrent users.',
      'Implemented event-driven architecture reducing latency by 45%.',
      'Modernized legacy stack to Next.js and Go microservices.'
    ],
    active: true
  },
  {
    year: '2021 — 2023',
    company: 'Nexus Systems',
    role: 'Backend Lead',
    details: [
      'Optimized data persistence layers for high-throughput I/O.',
      'Developed automated CI/CD pipelines for multi-cloud deployments.',
      'Managed a cross-functional team of 6 engineers.'
    ]
  },
  {
    year: '2019 — 2021',
    company: 'DataStream Corp',
    role: 'Junior Developer',
    details: [
      'Built internal tooling reducing manual QA time by 30%.',
      'Assisted in migration from monolithic to service-oriented architecture.'
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
