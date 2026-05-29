import { usePortfolioStore } from '../store/store';
import type { PortfolioNode } from '../store/store';

interface NodeCardProps {
  node: PortfolioNode;
}

export function NodeCard({ node }: NodeCardProps) {
  const setSelectedNodeId = usePortfolioStore((s) => s.setSelectedNodeId);

  return (
    <button
      type="button"
      onClick={() => setSelectedNodeId(node.id)}
      className="group w-full rounded-lg border border-outline bg-surface p-5 text-left transition-all duration-200 hover:-translate-y-[2px] hover:border-primary hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <h3 className="font-heading text-lg font-semibold text-on-surface">
        {node.label}
      </h3>

      <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-on-surface-variant">
        {node.brief}
      </p>

      {node.drawerDetails && (
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
      )}
    </button>
  );
}
