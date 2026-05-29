import { usePortfolioStore } from './store/store';
import { StandardView } from './components/StandardView';
import { GraphView } from './components/GraphView';
import { DetailDrawer } from './components/DetailDrawer';
import { GitGraph, Eye, Download } from 'lucide-react';

function App() {
  const viewMode = usePortfolioStore((s) => s.viewMode);
  const toggleViewMode = usePortfolioStore((s) => s.toggleViewMode);

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-outline bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <span className="font-heading text-xl font-bold tracking-tight text-on-surface">
            Mehul.
          </span>

          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-sm border border-outline px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>

            <button
              type="button"
              onClick={toggleViewMode}
              className="inline-flex items-center gap-2 rounded-sm border border-outline bg-transparent px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${viewMode === 'standard' ? 'Graph View' : 'Standard View'}`}
            >
              {viewMode === 'standard' ? (
                <>
                  <GitGraph className="h-4 w-4" />
                  Graph
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Standard
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative h-full w-full pt-16">
        {viewMode === 'standard' && <StandardView />}
        {viewMode === 'graph' && (
          <div className="h-[calc(100vh-4rem)] w-full">
            <GraphView />
          </div>
        )}
      </main>

      <DetailDrawer />
    </div>
  );
}

export default App;
