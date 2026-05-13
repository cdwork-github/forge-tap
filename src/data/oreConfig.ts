import { OreType } from '@/models/types';

export interface OreConfig {
  name: string;
  color: number;
  secondaryColor: number;
  emoji: string;
}

export const ORE_CONFIG: Record<OreType, OreConfig> = {
  [OreType.Fire]: {
    name: 'Fire',
    color: 0xe94560,
    secondaryColor: 0xff6b35,
    emoji: '🔥',
  },
  [OreType.Water]: {
    name: 'Water',
    color: 0x2196f3,
    secondaryColor: 0x64b5f6,
    emoji: '💧',
  },
  [OreType.Earth]: {
    name: 'Earth',
    color: 0x4caf50,
    secondaryColor: 0x81c784,
    emoji: '🌿',
  },
  [OreType.Void]: {
    name: 'Void',
    color: 0x9c27b0,
    secondaryColor: 0xce93d8,
    emoji: '🌀',
  },
};
