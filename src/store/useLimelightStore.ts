import { create } from 'zustand';

interface LimelightState {
  isLimelightActive: boolean;
  highlightedProjectIds: string[];
  activateLimelight: (projectIds: string | string[]) => void;
  deactivateLimelight: () => void;
  isProjectDetailsOpen: boolean;
  setProjectDetailsOpen: (isOpen: boolean) => void;
  isChatbotOpen: boolean;
  setChatbotOpen: (isOpen: boolean) => void;
  wasChatbotOpenBeforeDetails: boolean;
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
  isProjectDetailsOpen: false,
  setProjectDetailsOpen: (isOpen) =>
    set((state) => {
      if (isOpen) {
        return {
          isProjectDetailsOpen: true,
          wasChatbotOpenBeforeDetails: state.isChatbotOpen,
          isChatbotOpen: false, // Close chatbot automatically when details modal opens
        };
      } else {
        return {
          isProjectDetailsOpen: false,
          isChatbotOpen: state.wasChatbotOpenBeforeDetails ? true : state.isChatbotOpen, // Restore chatbot if it was open before
          wasChatbotOpenBeforeDetails: false,
        };
      }
    }),
  isChatbotOpen: false,
  setChatbotOpen: (isOpen) => set({ isChatbotOpen: isOpen }),
  wasChatbotOpenBeforeDetails: false,
}));

export const getSeededRandom = (seedStr: string, min: number, max: number): number => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const scaled = Math.abs(hash % 1000) / 1000;
  return min + scaled * (max - min);
};

export const getHighlightStyle = (_id: string, index: number, total: number) => {
  if (index === -1) return undefined;
  
  const isChatbotOpen = useLimelightStore.getState().isChatbotOpen;
  
  if (total === 1) {
    return {
      '--highlight-index': index,
      '--highlight-total': total,
      '--highlight-left': isChatbotOpen ? '32%' : '50%',
      '--highlight-top': '50%',
      '--highlight-rotate': '0deg',
      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    } as React.CSSProperties;
  }

  // Spacing out multiple elements horizontally to prevent overlaps
  const minLeft = 18;
  const maxLeft = isChatbotOpen ? 48 : 82;
  const range = maxLeft - minLeft;
  
  // Calculate left coordinate based on index relative to total
  const leftPercent = minLeft + (index / (total - 1)) * range;
  const left = `${leftPercent.toFixed(1)}%`;
  
  // Stagger height slightly to add organic feel without collision
  const topPercent = total > 2 
    ? 45 + (index % 2 === 0 ? -6 : 6)
    : 50;
  const top = `${topPercent}%`;
  
  // Stagger rotation
  const rotateDeg = index % 2 === 0 ? -2 : 2;
  const rotate = `${rotateDeg}deg`;

  return {
    '--highlight-index': index,
    '--highlight-total': total,
    '--highlight-left': left,
    '--highlight-top': top,
    '--highlight-rotate': rotate,
    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
  } as React.CSSProperties;
};
