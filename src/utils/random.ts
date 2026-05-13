import { Rarity } from '@/models/types';
import { RARITY_CONFIG } from '@/data/rarityConfig';

export function getWeightedRarity(): Rarity {
  const entries = Object.entries(RARITY_CONFIG) as [Rarity, { weight: number }][];
  const totalWeight = entries.reduce((sum, [, cfg]) => sum + cfg.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [rarity, cfg] of entries) {
    roll -= cfg.weight;
    if (roll <= 0) return rarity;
  }

  return Rarity.Common;
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
