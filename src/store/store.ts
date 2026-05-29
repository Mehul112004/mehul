import { create } from 'zustand';
import portfolioData from '../data/portfolio.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeGroup = 'project' | 'skill' | 'experience' | 'education';

export interface Workstream {
  title: string;
  description: string;
  appStore?: string;
  playStore?: string;
  live?: string;
}

export interface DrawerDetails {
  role: string;
  timeline: string;
  description: string;
  github: string | null;
  live: string | null;
  workstreams?: Workstream[];
}

export interface PortfolioNode {
  id: string;
  label: string;
  group: NodeGroup;
  brief: string;
  drawerDetails: DrawerDetails | null;
  connections: string[];
}

export interface PortfolioLink {
  source: string;
  target: string;
}

export type ViewMode = 'graph' | 'standard';

// ─── Store ────────────────────────────────────────────────────────────────────

interface PortfolioState {
  nodes: PortfolioNode[];
  links: PortfolioLink[];
  viewMode: ViewMode;
  selectedNodeId: string | null;

  // Derived helpers
  getNodeById: (id: string) => PortfolioNode | undefined;
  getConnectedNodes: (id: string) => PortfolioNode[];
  getNodesByGroup: (group: NodeGroup) => PortfolioNode[];

  // Actions
  toggleViewMode: () => void;
  setSelectedNodeId: (id: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  nodes: portfolioData.nodes as PortfolioNode[],
  links: portfolioData.links as PortfolioLink[],
  viewMode: 'standard',
  selectedNodeId: null,

  // ── Derived helpers ──────────────────────────────────────────────────────

  getNodeById: (id) => {
    return get().nodes.find((n) => n.id === id);
  },

  getConnectedNodes: (id) => {
    const { nodes, links } = get();
    const connectedIds = links
      .filter((l) => l.source === id || l.target === id)
      .map((l) => (l.source === id ? l.target : l.source));
    return nodes.filter((n) => connectedIds.includes(n.id));
  },

  getNodesByGroup: (group) => {
    return get().nodes.filter((n) => n.group === group);
  },

  // ── Actions ──────────────────────────────────────────────────────────────

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'graph' ? 'standard' : 'graph',
    })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
