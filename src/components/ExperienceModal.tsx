import { useState, useEffect } from 'react';
import styles from './ExperienceModal.module.css';

interface Workstream {
  title: string;
  description: string;
  appStore?: string;
  playStore?: string;
  live?: string;
}

interface ExperienceDetails {
  id: string;
  company: string;
  role: string;
  timeline: string;
  description: string;
  tags: string[];
  status: string;
  live: string | null;
  github: string | null;
  workstreams?: Workstream[];
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceDetails | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayed}</>;
}

export function ExperienceModal({ isOpen, onClose, experience }: ExperienceModalProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Particle generation
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 15,
        delay: Math.random() * -30,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isOpen]);

  if (!isOpen || !experience) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} id="experience-modal">
      {/* Background/Backdrop Overlay */}
      <div className={styles.backdrop}>
        {/* Grid Overlay */}
        <div className={styles.gridOverlay} />
        {/* Scanline */}
        <div className={styles.scanline} />
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Modal Content Wrapper */}
      <div className={styles.wrapper}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
        </button>

        {/* Sidebar/Aside Pane */}
        <aside className={styles.aside}>
          <div>
            <h3 className={styles.metaSectionTitle}>
              <TypewriterText text="Metadata" />
            </h3>
            <div className={styles.metaInfoList}>
              <div>
                <span className={styles.metaItemLabel}>Timeline</span>
                <span className={styles.metaItemValue}>{experience.timeline}</span>
              </div>
              <div>
                <span className={styles.metaItemLabel}>Status</span>
                <span className={`${styles.metaItemValue} ${styles.statusActive}`}>
                  {experience.status}
                </span>
              </div>
              <div>
                <span className={styles.metaItemLabel}>Position</span>
                <span className={styles.metaItemValue}>{experience.role}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.metaSectionTitle}>
              <TypewriterText text="Stack_Inventory" />
            </h3>
            <div className={styles.tagsContainer}>
              {experience.tags.map((tag, idx) => (
                <span key={idx} className={styles.stackTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className={styles.main}>
          <div className={styles.experienceHeader}>
            <h2 className={styles.companyTitle}>{experience.company}</h2>
            <p className={styles.roleSubtitle}>{experience.role}</p>
          </div>

          <p className={styles.experienceDescription}>{experience.description}</p>

          {/* Nested Workstreams */}
          {experience.workstreams && experience.workstreams.length > 0 && (
            <div className={styles.workstreamsSection}>
              <h3 className={styles.workstreamsTitle}>
                <TypewriterText text="Work_Streams" />
              </h3>
              <div className={styles.workstreamGrid}>
                {experience.workstreams.map((ws, idx) => (
                  <div key={idx} className={styles.workstreamCard}>
                    <div className={styles.workstreamHeader}>
                      <span className={styles.workstreamTitleText}>{ws.title}</span>
                    </div>
                    <p className={styles.workstreamDesc}>{ws.description}</p>
                    {(ws.appStore || ws.playStore || ws.live) && (
                      <div className={styles.workstreamLinks}>
                        {ws.appStore && (
                          <a
                            href={ws.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.workstreamLink}
                          >
                            App Store ↗
                          </a>
                        )}
                        {ws.playStore && (
                          <a
                            href={ws.playStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.workstreamLink}
                          >
                            Play Store ↗
                          </a>
                        )}
                        {ws.live && (
                          <a
                            href={ws.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.workstreamLink}
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            {experience.live ? (
              <a
                href={experience.live}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btnPrimary} ${styles.hoverFillBtn} ${styles.btnClickEffect}`}
              >
                VIEW WEBSITE
              </a>
            ) : (
              <span
                className={styles.btnPrimary}
                style={{ opacity: 0.4, cursor: 'not-allowed' }}
                title="NDA Restricted or Local Environment Only"
              >
                LOCAL ONLY
              </span>
            )}

            {experience.github ? (
              <a
                href={experience.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btnSecondary} ${styles.hoverFillBtn} ${styles.btnClickEffect}`}
              >
                BROWSE REPOSITORY
              </a>
            ) : (
              <span
                className={styles.btnSecondary}
                style={{ opacity: 0.4, cursor: 'not-allowed' }}
                title="Private Repository"
              >
                PRIVATE REPOSITORY
              </span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
