import { usePortfolioStore } from '../store/store';
import { NodeCard } from './NodeCard';

export function ProjectsGrid() {
  const getNodesByGroup = usePortfolioStore((s) => s.getNodesByGroup);
  const projects = getNodesByGroup('project');

  return (
    <section className="mb-section">
      <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-on-surface-variant">
        Projects
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <NodeCard key={project.id} node={project} />
        ))}
      </div>
    </section>
  );
}
