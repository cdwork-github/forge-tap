import { OreType } from './types';

export interface PlayerState {
  energy: number;
  maxEnergy: number;
  totalTaps: number;
  sessionTaps: number;
  currentForgeProgress: number;
  currentOreType: OreType;
  materials: Record<string, number>;
  items: Record<string, number>;
  unlockedRelicIds: string[];
  ascensionLevels: Record<string, number>;
  totalRunsCompleted: number;
  totalRunsAttempted: number;
  tutorialComplete: boolean;
  hintsShown: { tapped: boolean; forged: boolean; crafted: boolean };
}
