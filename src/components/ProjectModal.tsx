import { useState, useEffect } from "react";
import styles from "./ProjectModal.module.css";

interface ProjectDetails {
  id: string;
  version: string;
  iconName: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  role: string;
  timeline: string;
  status: string;
  live: string | null;
  github: string | null;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetails | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

function TypewriterText({
  text,
  speed = 40,
}: {
  text: string;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let currentText = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setDisplayed(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayed}</>;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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

  if (!isOpen || !project) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      id="project-modal"
    >
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
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className={`material-symbols-outlined ${styles.closeIcon}`}>
            close
          </span>
        </button>

        {/* Sidebar/Aside Pane */}
        <aside className={styles.aside}>
          <div>
            <h3 className={styles.metaSectionTitle}>
              <TypewriterText text="METADATA" />
            </h3>
            <div className={styles.metaInfoList}>
              <div>
                <span className={styles.metaItemLabel}>Version</span>
                <span className={styles.metaItemValue}>{project.version}</span>
              </div>
              <div>
                <span className={styles.metaItemLabel}>Status</span>
                <span
                  className={`${styles.metaItemValue} ${styles.statusActive}`}
                >
                  {project.status}
                </span>
              </div>
              <div>
                <span className={styles.metaItemLabel}>Role</span>
                <span className={styles.metaItemValue}>{project.role}</span>
              </div>
              <div>
                <span className={styles.metaItemLabel}>Timeline</span>
                <span className={styles.metaItemValue}>{project.timeline}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.metaSectionTitle}>
              <TypewriterText text="Stack_Inventory" />
            </h3>
            <div className={styles.tagsContainer}>
              {project.tags.map((tag, idx) => (
                <span key={idx} className={styles.stackTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className={styles.main}>
          <div>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            <p className={styles.projectDescription}>
              {project.longDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btnPrimary} ${styles.hoverFillBtn} ${styles.btnClickEffect}`}
              >
                VIEW LIVE PROJECT
              </a>
            ) : (
              <span
                className={styles.btnPrimary}
                style={{ opacity: 0.4, cursor: "not-allowed" }}
                title="NDA Restricted or Local Environment Only"
              >
                LOCAL RUN ONLY
              </span>
            )}

            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btnSecondary} ${styles.hoverFillBtn} ${styles.btnClickEffect}`}
              >
                BROWSE REPOSITORY
              </a>
            ) : (
              <span
                className={styles.btnSecondary}
                style={{ opacity: 0.4, cursor: "not-allowed" }}
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
