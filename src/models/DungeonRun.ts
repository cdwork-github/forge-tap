import { OreType } from './types';
import { Card } from './Card';
import { DungeonMap } from './MapNode';

export interface RunState {
  active: boolean;
  actId: string;
  oreAffinity: OreType;
  currentFloor: number;
  map: DungeonMap;
  deck: Card[];
  relicIds: string[];
  gold: number;
  hp: number;
  maxHp: number;
  maxEnergy: number;
  materialsEarned: Record<string, number>;
}
