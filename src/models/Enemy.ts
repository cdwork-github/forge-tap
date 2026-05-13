import { StatusEffectId } from './StatusEffect';

export type IntentType = 'attack' | 'block' | 'buff' | 'debuff' | 'multi_attack' | 'summon' | 'heal' | 'unknown';

export interface EnemyIntent {
  type: IntentType;
  damage?: number;
  hits?: number;
  block?: number;
  statusId?: StatusEffectId;
  statusStacks?: number;
  healAmount?: number;
  summonId?: string;
}

export interface EnemyMove {
  intent: EnemyIntent;
}

export interface WeightedMove {
  weight: number;
  move: EnemyMove;
}

export interface ConditionalRule {
  condition: 'hp_above_pct' | 'hp_below_pct' | 'every_n_turns' | 'player_has_status' | 'has_block';
  value: number | string;
  move: EnemyMove;
  fallback?: EnemyMove;
}

export type EnemyPattern =
  | { type: 'cycle'; moves: EnemyMove[] }
  | { type: 'random'; moves: WeightedMove[] }
  | { type: 'conditional'; rules: ConditionalRule[]; defaultMove: EnemyMove };

export type EnemyTier = 'basic' | 'elite' | 'boss';

export interface EnemyDef {
  id: string;
  name: string;
  tier: EnemyTier;
  hpRange: [number, number];
  pattern: EnemyPattern;
  color: number;
}

export interface EnemyInstance {
  defId: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  statuses: Map<StatusEffectId, number>;
  currentMoveIndex: number;
  turnCount: number;
  currentIntent: EnemyIntent;
}
