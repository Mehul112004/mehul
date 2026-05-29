import { usePortfolioStore } from '../store/store';

export function SkillsCluster() {
  const getNodesByGroup = usePortfolioStore((s) => s.getNodesByGroup);
  const skills = getNodesByGroup('skill');

  return (
    <section className="mb-section">
      <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-on-surface-variant">
        Skills
      </h2>
      <div className="mt-8 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-sm border border-outline bg-surface px-3 py-1.5 font-mono text-sm text-on-surface-variant transition-colors hover:border-primary"
          >
            {skill.label}
          </span>
        ))}
      </div>
    </section>
  );
}
