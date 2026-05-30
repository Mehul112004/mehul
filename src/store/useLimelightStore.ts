import { create } from 'zustand';

interface LimelightState {
  isLimelightActive: boolean;
  highlightedProjectIds: string[];
  activateLimelight: (projectIds: string | string[]) => void;
  deactivateLimelight: () => void;
}

export const useLimelightStore = create<LimelightState>((set) => ({
  isLimelightActive: false,
  highlightedProjectIds: [],
  activateLimelight: (projectIds) =>
    set({
      isLimelightActive: true,
      highlightedProjectIds: Array.isArray(projectIds) ? projectIds : [projectIds],
    }),
  deactivateLimelight: () =>
    set({
      isLimelightActive: false,
      highlightedProjectIds: [],
    }),
}));

export const getSeededRandom = (seedStr: string, min: number, max: number): number => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const scaled = Math.abs(hash % 1000) / 1000;
  return min + scaled * (max - min);
};

export const getHighlightStyle = (id: string, index: number, total: number) => {
  if (index === -1) return undefined;
  
  if (total === 1) {
    return {
      '--highlight-index': index,
      '--highlight-total': total,
      '--highlight-left': '50%',
      '--highlight-top': '50%',
      '--highlight-rotate': '0deg',
      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    } as React.CSSProperties;
  }

  const left = getSeededRandom(id + '-left', 20, 80).toFixed(1) + '%';
  const top = getSeededRandom(id + '-top', 20, 75).toFixed(1) + '%';
  const rotate = getSeededRandom(id + '-rotate', -6, 6).toFixed(1) + 'deg';

  return {
    '--highlight-index': index,
    '--highlight-total': total,
    '--highlight-left': left,
    '--highlight-top': top,
    '--highlight-rotate': rotate,
    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
  } as React.CSSProperties;
};
