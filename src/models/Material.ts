import { OreType, Rarity } from './types';

export interface Material {
  id: string;
  name: string;
  oreType: OreType;
  rarity: Rarity;
  description: string;
  color: number;
}
