
import styles from './Projects.module.css';
import { useLimelightStore } from '../store/useLimelightStore';

interface Project {
  version: string;
  iconName: string;
  title: string;
  description: string;
  tags: string[];
}

const PROJECTS_DATA: Project[] = [
  {
    version: 'v2.4.0',
    iconName: 'terminal',
    title: 'Crypto Algorithmic Trading Script',
    description: 'High-frequency trading engine built for low-latency execution and real-time risk management across distributed exchanges.',
    tags: ['RUST', 'WASM', 'GRPC']
  },
  {
    version: 'v1.0.8',
    iconName: 'database',
    title: 'Backend Architectures',
    description: 'Cloud-native microservices infrastructure designed for 99.99% uptime and elastic scalability using Kubernetes orchestration.',
    tags: ['GO', 'POSTGRES', 'K8S']
  },
  {
    version: 'v0.9.1',
    iconName: 'memory',
    title: 'Distributed KV Store',
    description: 'Consistent hash-based distributed storage system implementing the Raft consensus algorithm for fault tolerance.',
    tags: ['CPP', 'DISTRIBUTED']
  },
  {
    version: 'v4.2.0',
    iconName: 'layers',
    title: 'Real-time Data Fabric',
    description: 'Streaming pipeline for massive-scale telemetry ingestion and analytical processing using Apache Kafka and Spark.',
    tags: ['PYTHON', 'KAFKA']
  }
];

export function Projects() {
  const highlightedProjectId = useLimelightStore((state) => state.highlightedProjectId);

  return (
    <section className={styles.section} id="projects">
      <div className={styles.header}>
        <div>
          <span className={styles.label}>01 // SELECTED_WORKS</span>
          <h2 className={styles.title}>PROJECT_SHOWCASE</h2>
        </div>
        <div className={styles.totalItems}>Total: 04 Items</div>
      </div>
      
      <div className={styles.grid}>
        {PROJECTS_DATA.map((project, idx) => {
          const isHighlighted = idx === 0 && highlightedProjectId === 'crypto';
          return (
            <div 
              key={idx} 
              id={idx === 0 ? 'project-crypto' : undefined}
              className={`${styles.card} ${isHighlighted ? 'project-highlight-active' : ''}`}
              style={idx === 0 ? { transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)' } : undefined}
            >
              {isHighlighted && (
                <div className="source-tag">
                  SOURCE_REF: DONNA_v1.0.2
                </div>
              )}

              <div className={styles.cardHeader}>
                <span className={styles.version}>{project.version}</span>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                  {project.iconName}
                </span>
              </div>
              
              <div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>
                  {idx === 0 ? (
                    <>
                      High-frequency trading engine built for{' '}
                      <span className={`highlight-target ${isHighlighted ? 'text-mark' : ''}`}>
                        low-latency execution
                      </span>{' '}
                      and real-time{' '}
                      <span className={`highlight-target ${isHighlighted ? 'text-mark' : ''}`}>
                        risk management
                      </span>{' '}
                      across distributed exchanges.
                    </>
                  ) : (
                    project.description
                  )}
                </p>
                
                <div className={styles.techTags}>
                  {project.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
