import { Rarity } from './types';

export interface Recipe {
  id: string;
  materialIds: [string, string];
  resultItemId: string;
}

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  color: number;
  recipe: Recipe;
}
