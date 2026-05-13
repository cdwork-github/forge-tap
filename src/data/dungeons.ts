import { NodeType } from '@/models/MapNode';

export interface FloorTemplate {
  floor: number;
  possibleTypes: NodeType[];
  columns: number;
}

export interface DungeonConfig {
  id: string;
  name: string;
  actId: string;
  floors: FloorTemplate[];
  totalFloors: number;
}

const STANDARD_FLOORS: FloorTemplate[] = [
  { floor: 1,  possibleTypes: ['combat'],                columns: 3 },
  { floor: 2,  possibleTypes: ['event', 'combat'],       columns: 3 },
  { floor: 3,  possibleTypes: ['forge', 'combat'],       columns: 2 },
  { floor: 4,  possibleTypes: ['combat'],                columns: 3 },
  { floor: 5,  possibleTypes: ['rest', 'shop'],          columns: 2 },
  { floor: 6,  possibleTypes: ['combat'],                columns: 3 },
  { floor: 7,  possibleTypes: ['event', 'forge'],        columns: 2 },
  { floor: 8,  possibleTypes: ['elite'],                 columns: 1 },
  { floor: 9,  possibleTypes: ['rest', 'shop', 'event'], columns: 2 },
  { floor: 10, possibleTypes: ['boss'],                  columns: 1 },
];

export const DUNGEONS: DungeonConfig[] = [
  { id: 'dungeon_fire',  name: 'Fire Dungeon',  actId: 'fire',  floors: STANDARD_FLOORS, totalFloors: 10 },
  { id: 'dungeon_water', name: 'Water Dungeon', actId: 'water', floors: STANDARD_FLOORS, totalFloors: 10 },
  { id: 'dungeon_earth', name: 'Earth Dungeon', actId: 'earth', floors: STANDARD_FLOORS, totalFloors: 10 },
  { id: 'dungeon_void',  name: 'Void Dungeon',  actId: 'void',  floors: STANDARD_FLOORS, totalFloors: 10 },
];

export const DUNGEON_BY_ID = new Map(DUNGEONS.map((d) => [d.id, d]));
