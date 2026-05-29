import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code2 } from 'lucide-react';
import { usePortfolioStore } from '../store/store';

export function DetailDrawer() {
  const selectedNodeId = usePortfolioStore((s) => s.selectedNodeId);
  const setSelectedNodeId = usePortfolioStore((s) => s.setSelectedNodeId);
  const getNodeById = usePortfolioStore((s) => s.getNodeById);
  const getConnectedNodes = usePortfolioStore((s) => s.getConnectedNodes);

  const node = selectedNodeId ? getNodeById(selectedNodeId) : undefined;
  const connectedNodes = selectedNodeId
    ? getConnectedNodes(selectedNodeId)
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedNodeId]);

  return (
    <AnimatePresence>
      {node && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setSelectedNodeId(null)}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-outline bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${node.label}`}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-outline bg-background/90 px-6 py-4 backdrop-blur-md">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                {node.group}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="rounded-sm p-1.5 text-on-surface-variant transition-colors hover:bg-surface hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-8">
              <h2 className="font-heading text-2xl font-bold text-on-surface">
                {node.label}
              </h2>

              {node.drawerDetails && (
                <>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-sans text-sm text-on-surface-variant">
                      {node.drawerDetails.role}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant/70">
                      {node.drawerDetails.timeline}
                    </span>
                  </div>

                  <p className="mt-6 font-sans text-sm leading-relaxed text-on-surface-variant">
                    {node.drawerDetails.description}
                  </p>

                  {node.drawerDetails.workstreams &&
                    node.drawerDetails.workstreams.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                          Workstreams
                        </h3>
                        {node.drawerDetails.workstreams.map((ws, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-outline bg-surface p-4"
                          >
                            <h4 className="font-heading text-sm font-semibold text-on-surface">
                              {ws.title}
                            </h4>
                            <p className="mt-2 font-sans text-xs leading-relaxed text-on-surface-variant">
                              {ws.description}
                            </p>
                            {(ws.appStore || ws.playStore || ws.live) && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {ws.appStore && (
                                  <a
                                    href={ws.appStore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-sm bg-surface border border-outline px-2.5 py-1 font-mono text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    App Store
                                  </a>
                                )}
                                {ws.playStore && (
                                  <a
                                    href={ws.playStore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-sm bg-surface border border-outline px-2.5 py-1 font-mono text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Play Store
                                  </a>
                                )}
                                {ws.live && (
                                  <a
                                    href={ws.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-sm bg-surface border border-outline px-2.5 py-1 font-mono text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Live
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="mt-8 flex flex-wrap gap-2">
                    {node.drawerDetails.live && (
                      <a
                        href={node.drawerDetails.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-[#002e6a] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Live
                      </a>
                    )}
                    {node.drawerDetails.github && (
                      <a
                        href={node.drawerDetails.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-sm border border-outline bg-surface px-4 py-2 font-sans text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      >
                        <Code2 className="h-4 w-4" />
                        Source Code
                      </a>
                    )}
                  </div>
                </>
              )}

              {connectedNodes.length > 0 && (
                <div className="mt-8 border-t border-outline pt-8">
                  <h3 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {connectedNodes.map((cn) => (
                      <span
                        key={cn.id}
                        className="rounded-full border border-outline bg-surface px-3 py-1 font-mono text-xs text-on-surface-variant"
                      >
                        {cn.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
