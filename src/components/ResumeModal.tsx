import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./ResumeModal.module.css";

// Set up PDFJS Worker Source pointing to unpkg CDN for absolute compatibility in development and production
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export function ResumeModal({ isOpen, onClose, resumeUrl }: ResumeModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.85);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Set smaller scale on mobile initially
  useEffect(() => {
    if (isOpen) {
      if (window.innerWidth < 768) {
        setScale(0.65);
      } else {
        setScale(0.85);
      }
    }
  }, [isOpen]);

  // Particle generation matching project modal
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
      setIsLoading(true);
    } else {
      setParticles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function handlePrevPage() {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  }

  function handleNextPage() {
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  }

  function handleZoomIn() {
    setScale((prev) => Math.min(prev + 0.15, 1.5));
  }

  function handleZoomOut() {
    setScale((prev) => Math.max(prev - 0.15, 0.5));
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      id="resume-modal"
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

        {/* Main Content Pane */}
        <main className={styles.main}>
          <div className={styles.header}>
            <h2 className={styles.modalTitle}>MEHUL_RESUME.PDF</h2>
          </div>

          <div className={styles.pdfViewer}>
            {isLoading && (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <span className={styles.loadingText}>
                  INGESTING_RESUME_DECKS...
                </span>
              </div>
            )}
            <div className={styles.pdfScrollWrapper}>
              <Document
                file={resumeUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={null}
                />
              </Document>
            </div>
          </div>

          {/* Controls Bar */}
          <div className={styles.pdfControls}>
            <div className={styles.navControls}>
              <button
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                className={styles.controlBtn}
                title="Previous Page"
              >
                <span className="material-symbols-outlined">
                  navigate_before
                </span>
              </button>
              <div className={styles.pageIndicator}>
                {pageNumber} / {numPages || "..."}
              </div>
              <button
                onClick={handleNextPage}
                disabled={numPages === null || pageNumber >= numPages}
                className={styles.controlBtn}
                title="Next Page"
              >
                <span className="material-symbols-outlined">navigate_next</span>
              </button>
            </div>

            <div className={styles.zoomControls}>
              <button
                onClick={handleZoomOut}
                className={styles.zoomBtn}
                title="Zoom Out"
              >
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
              <span className={styles.zoomText}>
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className={styles.zoomBtn}
                title="Zoom In"
              >
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <a
              href={resumeUrl}
              download="Mehul_Bohra_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btnPrimary} ${styles.hoverFillBtn} ${styles.btnClickEffect}`}
            >
              DOWNLOAD_DOCUMENT
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
