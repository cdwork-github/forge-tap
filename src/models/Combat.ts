import { Card } from './Card';
import { EnemyInstance } from './Enemy';
import { StatusEffectId } from './StatusEffect';

export interface CombatState {
  playerHp: number;
  playerMaxHp: number;
  playerBlock: number;
  playerEnergy: number;
  playerMaxEnergy: number;
  playerStatuses: Map<StatusEffectId, number>;
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  enemies: EnemyInstance[];
  turn: number;
  oreTapped: boolean;
  selectedCardIndex: number | null;
  isPlayerTurn: boolean;
}
