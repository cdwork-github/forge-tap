import { OreType } from '@/models/types';
import { RunState } from '@/models/DungeonRun';
import { DungeonMap, MapNode } from '@/models/MapNode';
import { Card } from '@/models/Card';
import { getStarterDeck } from '@/data/cards';
import { DUNGEON_BY_ID } from '@/data/dungeons';
import { pickRandom } from '@/utils/random';
import { upgradeCard } from '@/utils/cardUpgrade';

type EventCallback = (...args: unknown[]) => void;

export class RunStore {
  private static instance: RunStore | null = null;
  private state: RunState;
  private listeners = new Map<string, Set<EventCallback>>();

  private constructor() {
    this.state = this.defaultState();
  }

  static getInstance(): RunStore {
    if (!RunStore.instance) {
      RunStore.instance = new RunStore();
    }
    return RunStore.instance;
  }

  static reset(): void {
    RunStore.instance = null;
  }

  getState(): Readonly<RunState> {
    return this.state;
  }

  startRun(dungeonId: string, oreAffinity: OreType): void {
    const dungeon = DUNGEON_BY_ID.get(dungeonId);
    if (!dungeon) return;

    this.state = {
      active: true,
      actId: dungeon.actId,
      oreAffinity,
      currentFloor: 0,
      map: this.generateMap(dungeon.actId),
      deck: getStarterDeck(oreAffinity),
      relicIds: [],
      gold: 0,
      hp: 70,
      maxHp: 80,
      maxEnergy: 3,
      materialsEarned: {},
    };

    this.emit('run-started');
  }

  selectNode(nodeId: string): MapNode | null {
    const node = this.state.map.nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    // Validate: must be connected from current node (or floor 1 start)
    if (this.state.map.currentNodeId) {
      const currentNode = this.state.map.nodes.find((n) => n.id === this.state.map.currentNodeId);
      if (!currentNode?.connections.includes(nodeId)) return null;
    } else if (node.floor !== 1) {
      return null;
    }

    node.visited = true;
    this.state.map.currentNodeId = nodeId;
    this.state.currentFloor = node.floor;
    this.emit('node-selected', node);
    return node;
  }

  addCardToDeck(card: Card): void {
    this.state.deck.push({ ...card });
    this.emit('deck-changed');
  }

  removeCardFromDeck(index: number): void {
    if (index >= 0 && index < this.state.deck.length) {
      this.state.deck.splice(index, 1);
      this.emit('deck-changed');
    }
  }

  upgradeCardInDeck(index: number): boolean {
    if (index < 0 || index >= this.state.deck.length) return false;
    const card = this.state.deck[index];
    if (card.upgraded) return false;
    this.state.deck[index] = upgradeCard(card);
    this.emit('deck-changed');
    return true;
  }

  addGold(amount: number): void {
    this.state.gold += amount;
    this.emit('gold-changed');
  }

  spendGold(amount: number): boolean {
    if (this.state.gold < amount) return false;
    this.state.gold -= amount;
    this.emit('gold-changed');
    return true;
  }

  takeDamage(amount: number): void {
    this.state.hp = Math.max(0, this.state.hp - amount);
    this.emit('hp-changed');
    if (this.state.hp <= 0) {
      this.endRun(false);
    }
  }

  heal(amount: number): void {
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + amount);
    this.emit('hp-changed');
  }

  addRelic(relicId: string): void {
    if (!this.state.relicIds.includes(relicId)) {
      this.state.relicIds.push(relicId);
      this.emit('relic-added', relicId);
    }
  }

  earnMaterial(materialId: string): void {
    this.state.materialsEarned[materialId] = (this.state.materialsEarned[materialId] ?? 0) + 1;
  }

  endRun(victory: boolean): void {
    this.state.active = false;
    this.emit('run-ended', victory, this.state.materialsEarned);
  }

  isRunActive(): boolean {
    return this.state.active;
  }

  getAvailableNodes(): MapNode[] {
    if (!this.state.map.currentNodeId) {
      return this.state.map.nodes.filter((n) => n.floor === 1);
    }
    const current = this.state.map.nodes.find((n) => n.id === this.state.map.currentNodeId);
    if (!current) return [];
    return this.state.map.nodes.filter((n) => current.connections.includes(n.id));
  }

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((cb) => cb(...args));
  }

  private defaultState(): RunState {
    return {
      active: false,
      actId: '',
      oreAffinity: OreType.Fire,
      currentFloor: 0,
      map: { nodes: [], currentNodeId: null },
      deck: [],
      relicIds: [],
      gold: 0,
      hp: 70,
      maxHp: 80,
      maxEnergy: 3,
      materialsEarned: {},
    };
  }

  private generateMap(actId: string): DungeonMap {
    const dungeon = [...DUNGEON_BY_ID.values()].find((d) => d.actId === actId);
    if (!dungeon) return { nodes: [], currentNodeId: null };

    const nodes: MapNode[] = [];
    const floorNodes: MapNode[][] = [];

    // Generate nodes per floor
    for (const template of dungeon.floors) {
      const row: MapNode[] = [];
      for (let col = 0; col < template.columns; col++) {
        const type = pickRandom(template.possibleTypes);
        const node: MapNode = {
          id: `f${template.floor}_c${col}`,
          floor: template.floor,
          column: col,
          type,
          connections: [],
          visited: false,
          x: this.calcNodeX(col, template.columns),
          y: this.calcNodeY(template.floor, dungeon.totalFloors),
        };
        row.push(node);
        nodes.push(node);
      }
      floorNodes.push(row);
    }

    // Connect floors: each node connects to 1-2 nodes on the next floor
    for (let f = 0; f < floorNodes.length - 1; f++) {
      const current = floorNodes[f];
      const next = floorNodes[f + 1];

      for (const node of current) {
        // Always connect to at least one node on next floor
        const primaryIdx = Math.min(node.column, next.length - 1);
        node.connections.push(next[primaryIdx].id);

        // Possibly connect to an adjacent node too
        if (next.length > 1 && Math.random() > 0.4) {
          const altIdx = primaryIdx === 0 ? 1 : primaryIdx - 1;
          if (altIdx >= 0 && altIdx < next.length && !node.connections.includes(next[altIdx].id)) {
            node.connections.push(next[altIdx].id);
          }
        }
      }

      // Ensure every next-floor node has at least one incoming connection
      for (const nextNode of next) {
        const hasIncoming = current.some((n) => n.connections.includes(nextNode.id));
        if (!hasIncoming) {
          const closest = current.reduce((best, n) =>
            Math.abs(n.column - nextNode.column) < Math.abs(best.column - nextNode.column) ? n : best,
          );
          closest.connections.push(nextNode.id);
        }
      }
    }

    return { nodes, currentNodeId: null };
  }

  private calcNodeX(col: number, totalCols: number): number {
    const padding = 60;
    const usable = 390 - padding * 2;
    if (totalCols === 1) return 195;
    return padding + (col / (totalCols - 1)) * usable;
  }

  private calcNodeY(floor: number, totalFloors: number): number {
    const topPad = 80;
    const botPad = 60;
    const usable = 844 - topPad - botPad;
    // Floor 1 at bottom, boss at top
    return topPad + ((totalFloors - floor) / (totalFloors - 1)) * usable;
  }
}
