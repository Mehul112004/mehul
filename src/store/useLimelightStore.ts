import { create } from 'zustand';

interface LimelightState {
  isLimelightActive: boolean;
  highlightedProjectId: string | null;
  activateLimelight: (projectId: string) => void;
  deactivateLimelight: () => void;
}

export const useLimelightStore = create<LimelightState>((set) => ({
  isLimelightActive: false,
  highlightedProjectId: null,
  activateLimelight: (projectId) =>
    set({
      isLimelightActive: true,
      highlightedProjectId: projectId,
    }),
  deactivateLimelight: () =>
    set({
      isLimelightActive: false,
      highlightedProjectId: null,
    }),
}));
