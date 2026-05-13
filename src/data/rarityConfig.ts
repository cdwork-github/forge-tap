import { Rarity } from '@/models/types';

export interface RarityConfig {
  label: string;
  color: number;
  backgroundColor: number;
  weight: number;
  particleCount: number;
}

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  [Rarity.Common]: {
    label: 'Common',
    color: 0xb0b0b0,
    backgroundColor: 0x3a3a3a,
    weight: 50,
    particleCount: 5,
  },
  [Rarity.Uncommon]: {
    label: 'Uncommon',
    color: 0x4caf50,
    backgroundColor: 0x1b5e20,
    weight: 25,
    particleCount: 10,
  },
  [Rarity.Rare]: {
    label: 'Rare',
    color: 0x2196f3,
    backgroundColor: 0x0d47a1,
    weight: 15,
    particleCount: 15,
  },
  [Rarity.Epic]: {
    label: 'Epic',
    color: 0x9c27b0,
    backgroundColor: 0x4a148c,
    weight: 8,
    particleCount: 25,
  },
  [Rarity.Legendary]: {
    label: 'Legendary',
    color: 0xffd700,
    backgroundColor: 0x8b6914,
    weight: 2,
    particleCount: 40,
  },
};
