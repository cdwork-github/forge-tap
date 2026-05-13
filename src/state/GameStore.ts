import { OreType } from '@/models/types';
import { PlayerState } from '@/models/PlayerState';

type EventCallback = (...args: unknown[]) => void;

const STORAGE_KEY = 'forge-tap-state';
const TAPS_PER_FORGE = 50;
const ENERGY_PER_TAP = 1;

export class GameStore {
  private static instance: GameStore;
  private state: PlayerState;
  private listeners = new Map<string, Set<EventCallback>>();

  private constructor() {
    this.state = this.loadOrDefault();
  }

  static getInstance(): GameStore {
    if (!GameStore.instance) {
      GameStore.instance = new GameStore();
    }
    return GameStore.instance;
  }

  getState(): Readonly<PlayerState> {
    return this.state;
  }

  tap(): boolean {
    if (this.state.energy <= 0) return false;

    this.state.totalTaps++;
    this.state.sessionTaps++;
    this.state.currentForgeProgress++;
    this.state.energy = Math.max(0, this.state.energy - ENERGY_PER_TAP);

    this.emit('tap');
    this.emit('energy-change');

    if (this.state.currentForgeProgress >= TAPS_PER_FORGE) {
      this.state.currentForgeProgress = 0;
      this.emit('forge');
    }

    this.save();
    return true;
  }

  setOreType(ore: OreType): void {
    this.state.currentOreType = ore;
    this.emit('ore-change');
    this.save();
  }

  addMaterial(materialId: string): void {
    this.state.materials[materialId] = (this.state.materials[materialId] ?? 0) + 1;
    this.emit('material-added', materialId);
    this.save();
  }

  craftItem(recipeId: string, materialIds: [string, string]): boolean {
    const [a, b] = materialIds;
    if ((this.state.materials[a] ?? 0) < 1 || (this.state.materials[b] ?? 0) < 1) {
      return false;
    }
    this.state.materials[a]--;
    this.state.materials[b]--;
    this.state.items[recipeId] = (this.state.items[recipeId] ?? 0) + 1;
    this.emit('item-crafted', recipeId);
    this.save();
    return true;
  }

  // Intentionally does not save -- energy resets each session via loadOrDefault
  depleteEnergy(amount: number): void {
    this.state.energy = Math.max(0, this.state.energy - amount);
    this.emit('energy-change');
  }

  refillEnergy(): void {
    this.state.energy = this.state.maxEnergy;
    this.state.sessionTaps = 0;
    this.emit('energy-change');
    this.save();
  }

  regenEnergy(amount: number): void {
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + amount);
    this.emit('energy-change');
  }

  resetForgeProgress(): void {
    this.state.currentForgeProgress = 0;
    this.save();
  }

  getMaterialCount(materialId: string): number {
    return this.state.materials[materialId] ?? 0;
  }

  getTotalMaterialCount(): number {
    return Object.values(this.state.materials).reduce((sum, n) => sum + n, 0);
  }

  unlockRelic(relicId: string): void {
    if (!this.state.unlockedRelicIds.includes(relicId)) {
      this.state.unlockedRelicIds.push(relicId);
      this.emit('relic-unlocked', relicId);
      this.save();
    }
  }

  isRelicUnlocked(relicId: string): boolean {
    return this.state.unlockedRelicIds.includes(relicId);
  }

  getAscensionLevel(actId: string): number {
    return this.state.ascensionLevels[actId] ?? 0;
  }

  incrementAscension(actId: string): void {
    const current = this.state.ascensionLevels[actId] ?? 0;
    if (current < 10) {
      this.state.ascensionLevels[actId] = current + 1;
      this.save();
    }
  }

  isDungeonUnlocked(actId: string): boolean {
    const unlockChain: Record<string, string | null> = {
      fire: null,
      water: 'fire',
      earth: 'water',
      void: 'earth',
    };
    const prerequisite = unlockChain[actId];
    if (prerequisite === null || prerequisite === undefined) return true;
    return (this.state.ascensionLevels[prerequisite] ?? 0) >= 1;
  }

  isTutorialComplete(): boolean {
    return this.state.tutorialComplete;
  }

  completeTutorial(): void {
    this.state.tutorialComplete = true;
    this.save();
  }

  isHintShown(hint: keyof PlayerState['hintsShown']): boolean {
    return this.state.hintsShown[hint];
  }

  markHintShown(hint: keyof PlayerState['hintsShown']): void {
    this.state.hintsShown[hint] = true;
    this.save();
  }

  recordRunEnd(victory: boolean, materialsEarned: Record<string, number>): void {
    this.state.totalRunsAttempted++;
    if (victory) this.state.totalRunsCompleted++;

    for (const [matId, count] of Object.entries(materialsEarned)) {
      for (let i = 0; i < count; i++) {
        this.addMaterial(matId);
      }
    }

    this.save();
  }

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((cb) => cb(...args));
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // localStorage unavailable or full -- silently continue
    }
  }

  private loadOrDefault(): PlayerState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlayerState;
        // Reset session-specific values
        parsed.sessionTaps = 0;
        parsed.energy = parsed.maxEnergy;
        // Migration: add new fields if missing from old saves
        parsed.unlockedRelicIds ??= [];
        parsed.ascensionLevels ??= {};
        parsed.totalRunsCompleted ??= 0;
        parsed.totalRunsAttempted ??= 0;
        parsed.tutorialComplete ??= false;
        parsed.hintsShown ??= { tapped: false, forged: false, crafted: false };
        return parsed;
      }
    } catch {
      // Corrupted data -- start fresh
    }
    return {
      energy: 100,
      maxEnergy: 100,
      totalTaps: 0,
      sessionTaps: 0,
      currentForgeProgress: 0,
      currentOreType: OreType.Fire,
      materials: {},
      items: {},
      unlockedRelicIds: [],
      ascensionLevels: {},
      totalRunsCompleted: 0,
      totalRunsAttempted: 0,
      tutorialComplete: false,
      hintsShown: { tapped: false, forged: false, crafted: false },
    };
  }
}
