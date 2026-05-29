
import styles from './TechStack.module.css';

const TECH_ITEMS = [
  'GO',
  'RUST',
  'TYPESCRIPT',
  'KUBERNETES',
  'DOCKER',
  'REACT',
  'POSTGRESQL',
  'REDIS',
  'AWS',
  'PYTHON',
  'GRPC',
  'KAFKA'
];

export function TechStack() {
  return (
    <section className={styles.section} id="stack">
      <div className={styles.header}>
        <span className={styles.label}>03 // STACK_INVENTORY</span>
        <h2 className={styles.title}>CORE_TECHNOLOGIES</h2>
      </div>

      <div className={styles.grid}>
        {TECH_ITEMS.map((tech, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.techName}>{tech}</div>
            <div className={styles.dot}></div>
          </div>
        ))}
      </div>
    </section>
  );
}
