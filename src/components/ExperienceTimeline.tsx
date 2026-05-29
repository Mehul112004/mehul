import { usePortfolioStore } from '../store/store';

export function ExperienceTimeline() {
  const getNodesByGroup = usePortfolioStore((s) => s.getNodesByGroup);
  const setSelectedNodeId = usePortfolioStore((s) => s.setSelectedNodeId);
  const experiences = getNodesByGroup('experience');
  const education = getNodesByGroup('education');
  const items = [...experiences, ...education];

  return (
    <section className="mb-section">
      <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-on-surface-variant">
        Experience
      </h2>
      <div className="relative mt-8 pl-6">
        <div className="absolute left-0 top-1.5 bottom-0 w-px bg-outline" />

        {items.map((item) => (
          <div key={item.id} className="relative mb-8">
            <div className="absolute -left-[25px] top-4 h-3 w-3 bg-primary" />

            <button
              type="button"
              onClick={() => setSelectedNodeId(item.id)}
              className="group w-full rounded-lg border border-outline bg-surface p-5 text-left transition-all duration-200 hover:-translate-y-[2px] hover:border-primary hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <h3 className="font-heading text-lg font-semibold text-on-surface">
                {item.label}
              </h3>

              {item.drawerDetails && (
                <>
                  <p className="mt-1 font-sans text-sm text-on-surface-variant">
                    {item.drawerDetails.role}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-on-surface-variant/70">
                    {item.drawerDetails.timeline}
                  </p>
                </>
              )}

              <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-on-surface-variant">
                {item.brief}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-on-surface-variant/60 transition-colors group-hover:text-primary">
                View details
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
