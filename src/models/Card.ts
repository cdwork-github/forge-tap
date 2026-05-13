import { OreType, Rarity } from './types';
import { StatusEffectId } from './StatusEffect';

export type CardType = 'attack' | 'skill' | 'power';
export type Keyword = 'exhaust' | 'ethereal' | 'innate' | 'retain';

export interface CardEffect {
  type: 'damage' | 'block' | 'apply_status' | 'heal' | 'draw' | 'gain_energy' | 'aoe_damage';
  value: number;
  target?: 'enemy' | 'self' | 'all_enemies';
  statusId?: StatusEffectId;
}

export interface Card {
  id: string;
  materialId: string;
  name: string;
  type: CardType;
  cost: number;
  rarity: Rarity;
  oreType: OreType | 'colorless';
  effects: CardEffect[];
  keywords: Keyword[];
  description: string;
  upgraded: boolean;
}
