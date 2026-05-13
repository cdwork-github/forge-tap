export type NodeType = 'combat' | 'elite' | 'forge' | 'rest' | 'shop' | 'event' | 'boss';

export interface MapNode {
  id: string;
  floor: number;
  column: number;
  type: NodeType;
  connections: string[];
  visited: boolean;
  x: number;
  y: number;
}

export interface DungeonMap {
  nodes: MapNode[];
  currentNodeId: string | null;
}
