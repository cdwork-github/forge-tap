import { Card } from '@/models/Card';
import { CombatState } from '@/models/Combat';
import { EnemyDef, EnemyInstance } from '@/models/Enemy';
import { StatusEffectId } from '@/models/StatusEffect';
import { ENEMY_BY_ID } from '@/data/enemies';
import { pickRandom } from '@/utils/random';

type EventCallback = (...args: unknown[]) => void;

const HAND_SIZE = 5;
const ORE_TAP_ENERGY = 1;
const ORE_TAP_DAMAGE = 3;

export class CombatStore {
  private static instance: CombatStore | null = null;
  private state!: CombatState;
  private listeners = new Map<string, Set<EventCallback>>();

  private constructor() {}

  static getInstance(): CombatStore {
    if (!CombatStore.instance) {
      CombatStore.instance = new CombatStore();
    }
    return CombatStore.instance;
  }

  static reset(): void {
    CombatStore.instance = null;
  }

  getState(): Readonly<CombatState> {
    return this.state;
  }

  initCombat(deck: Card[], playerHp: number, playerMaxHp: number, maxEnergy: number, enemyIds: string[]): void {
    const drawPile = this.shuffle([...deck]);
    const enemies = enemyIds
      .map((id) => this.createEnemyInstance(id))
      .filter((e): e is EnemyInstance => e !== null);

    this.state = {
      playerHp,
      playerMaxHp,
      playerBlock: 0,
      playerEnergy: maxEnergy,
      playerMaxEnergy: maxEnergy,
      playerStatuses: new Map(),
      hand: [],
      drawPile,
      discardPile: [],
      exhaustPile: [],
      enemies,
      turn: 1,
      oreTapped: false,
      selectedCardIndex: null,
      isPlayerTurn: true,
    };

    this.startPlayerTurn();
  }

  // === PLAYER ACTIONS ===

  selectCard(index: number): void {
    if (!this.state.isPlayerTurn) return;
    if (index < 0 || index >= this.state.hand.length) return;

    const card = this.state.hand[index];
    if (card.cost > this.state.playerEnergy) {
      this.state.selectedCardIndex = null;
      this.emit('card-deselected');
      return;
    }

    this.state.selectedCardIndex = index;
    this.emit('card-selected', index, card);
  }

  playCard(targetEnemyIndex?: number): boolean {
    if (this.state.selectedCardIndex === null) return false;
    if (!this.state.isPlayerTurn) return false;

    const cardIndex = this.state.selectedCardIndex;
    const card = this.state.hand[cardIndex];

    if (card.cost > this.state.playerEnergy) return false;
    if (card.cost === -1) return false; // Unplayable (Curse)

    // Spend energy
    this.state.playerEnergy -= card.cost;

    // Resolve effects
    for (const effect of card.effects) {
      const targetIdx = targetEnemyIndex ?? 0;

      switch (effect.type) {
        case 'damage': {
          const dmg = this.calcPlayerDamage(effect.value);
          if (targetIdx >= 0 && targetIdx < this.state.enemies.length) {
            this.dealDamageToEnemy(targetIdx, dmg);
          }
          break;
        }
        case 'aoe_damage': {
          const dmg = this.calcPlayerDamage(effect.value);
          for (let i = this.state.enemies.length - 1; i >= 0; i--) {
            this.dealDamageToEnemy(i, dmg);
          }
          break;
        }
        case 'block': {
          this.state.playerBlock += effect.value;
          break;
        }
        case 'heal': {
          this.state.playerHp = Math.min(this.state.playerMaxHp, this.state.playerHp + effect.value);
          break;
        }
        case 'draw': {
          this.drawCards(effect.value);
          break;
        }
        case 'gain_energy': {
          this.state.playerEnergy += effect.value;
          break;
        }
        case 'apply_status': {
          if (effect.statusId) {
            if (effect.target === 'self') {
              this.applyStatusToPlayer(effect.statusId, effect.value);
            } else if (effect.target === 'all_enemies') {
              for (const enemy of this.state.enemies) {
                this.applyStatusToEnemy(enemy, effect.statusId, effect.value);
              }
            } else if (targetIdx >= 0 && targetIdx < this.state.enemies.length) {
              this.applyStatusToEnemy(this.state.enemies[targetIdx], effect.statusId, effect.value);
            }
          }
          break;
        }
      }
    }

    // Remove card from hand
    this.state.hand.splice(cardIndex, 1);
    this.state.selectedCardIndex = null;

    // Handle keywords
    if (card.keywords.includes('exhaust')) {
      this.state.exhaustPile.push(card);
    } else {
      this.state.discardPile.push(card);
    }

    this.emit('card-played', card);

    // Check if all enemies dead
    if (this.state.enemies.length === 0) {
      this.emit('combat-victory');
      return true;
    }

    return true;
  }

  tapOre(): boolean {
    if (!this.state.isPlayerTurn || this.state.oreTapped) return false;
    this.state.oreTapped = true;
    this.state.playerEnergy += ORE_TAP_ENERGY;

    // Take damage (bypasses block)
    this.state.playerHp -= ORE_TAP_DAMAGE;
    this.emit('ore-tapped');

    if (this.state.playerHp <= 0) {
      this.emit('combat-defeat');
    }

    return true;
  }

  endPlayerTurn(): void {
    if (!this.state.isPlayerTurn) return;
    this.state.isPlayerTurn = false;
    this.state.selectedCardIndex = null;

    // Discard hand (handle Retain keyword)
    const retained: Card[] = [];
    for (const card of this.state.hand) {
      if (card.keywords.includes('retain')) {
        retained.push(card);
      } else if (card.keywords.includes('ethereal')) {
        this.state.exhaustPile.push(card);
      } else {
        this.state.discardPile.push(card);
      }
    }
    this.state.hand = retained;

    // End of turn: Burn damage
    const burn = this.state.playerStatuses.get('burn') ?? 0;
    if (burn > 0) {
      this.state.playerHp -= burn;
      this.state.playerStatuses.set('burn', burn - 1);
      if (burn - 1 <= 0) this.state.playerStatuses.delete('burn');
    }

    // Block resets (unless Armor)
    const armor = this.state.playerStatuses.get('armor') ?? 0;
    if (armor <= 0) {
      this.state.playerBlock = 0;
    } else {
      this.state.playerStatuses.set('armor', armor - 1);
      if (armor - 1 <= 0) this.state.playerStatuses.delete('armor');
    }

    if (this.state.playerHp <= 0) {
      this.emit('combat-defeat');
      return;
    }

    this.emit('player-turn-ended');
  }

  // === ENEMY TURN ===

  executeEnemyTurns(): void {
    for (let i = 0; i < this.state.enemies.length; i++) {
      const enemy = this.state.enemies[i];
      this.executeEnemyAction(enemy);

      if (this.state.playerHp <= 0) {
        this.emit('combat-defeat');
        return;
      }
    }

    // Tick enemy counter statuses
    for (const enemy of this.state.enemies) {
      this.tickEnemyStatuses(enemy);
      this.rollNextIntent(enemy);
    }

    // Tick player counter statuses (weakness, vulnerable, freeze)
    this.tickPlayerCounterStatuses();

    this.state.turn++;
    this.startPlayerTurn();
  }

  // === INTERNAL ===

  private startPlayerTurn(): void {
    this.state.isPlayerTurn = true;
    this.state.playerEnergy = this.state.playerMaxEnergy;
    this.state.oreTapped = false;

    // Start of turn: Poison damage
    const poison = this.state.playerStatuses.get('poison') ?? 0;
    if (poison > 0) {
      this.state.playerHp -= poison;
    }

    // Regen
    const regen = this.state.playerStatuses.get('regen') ?? 0;
    if (regen > 0) {
      this.state.playerHp = Math.min(this.state.playerMaxHp, this.state.playerHp + regen);
      this.state.playerStatuses.set('regen', regen - 1);
      if (regen - 1 <= 0) this.state.playerStatuses.delete('regen');
    }

    if (this.state.playerHp <= 0) {
      this.emit('combat-defeat');
      return;
    }

    this.drawCards(HAND_SIZE - this.state.hand.length);
    this.emit('player-turn-started');
  }

  private drawCards(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.state.drawPile.length === 0) {
        if (this.state.discardPile.length === 0) break;
        this.state.drawPile = this.shuffle([...this.state.discardPile]);
        this.state.discardPile = [];
      }
      const card = this.state.drawPile.pop();
      if (card) this.state.hand.push(card);
    }
  }

  private calcPlayerDamage(baseDamage: number): number {
    let dmg = baseDamage;
    const str = this.state.playerStatuses.get('strength') ?? 0;
    dmg += str;
    const weak = this.state.playerStatuses.get('weakness') ?? 0;
    if (weak > 0) dmg = Math.floor(dmg * 0.75);
    return Math.max(0, dmg);
  }

  private dealDamageToEnemy(enemyIndex: number, damage: number): void {
    const enemy = this.state.enemies[enemyIndex];
    if (!enemy) return;

    const vuln = enemy.statuses.get('vulnerable') ?? 0;
    let finalDmg = vuln > 0 ? Math.floor(damage * 1.5) : damage;

    // Apply to block first
    if (enemy.block > 0) {
      const blocked = Math.min(enemy.block, finalDmg);
      enemy.block -= blocked;
      finalDmg -= blocked;
    }

    enemy.hp -= finalDmg;

    // Thorns
    const thorns = enemy.statuses.get('thorns') ?? 0;
    if (thorns > 0) {
      this.state.playerHp -= thorns;
    }

    if (enemy.hp <= 0) {
      this.state.enemies.splice(enemyIndex, 1);
      this.emit('enemy-died', enemyIndex);
    }
  }

  private executeEnemyAction(enemy: EnemyInstance): void {
    const intent = enemy.currentIntent;

    // Check freeze
    const freeze = enemy.statuses.get('freeze') ?? 0;
    if (freeze > 0) {
      enemy.statuses.set('freeze', freeze - 1);
      if (freeze - 1 <= 0) enemy.statuses.delete('freeze');
      return;
    }

    switch (intent.type) {
      case 'attack': {
        const dmg = (intent.damage ?? 0) + (enemy.statuses.get('strength') ?? 0);
        this.dealDamageToPlayer(dmg);
        break;
      }
      case 'multi_attack': {
        const dmg = (intent.damage ?? 0) + (enemy.statuses.get('strength') ?? 0);
        const hits = intent.hits ?? 1;
        for (let i = 0; i < hits; i++) {
          this.dealDamageToPlayer(dmg);
          if (this.state.playerHp <= 0) break;
        }
        break;
      }
      case 'block': {
        enemy.block += intent.block ?? 0;
        break;
      }
      case 'buff': {
        if (intent.statusId) {
          this.applyStatusToEnemy(enemy, intent.statusId, intent.statusStacks ?? 1);
        }
        break;
      }
      case 'debuff': {
        if (intent.statusId) {
          this.applyStatusToPlayer(intent.statusId, intent.statusStacks ?? 1);
        }
        break;
      }
      case 'heal': {
        const def = ENEMY_BY_ID.get(enemy.defId);
        const maxHp = def ? def.hpRange[1] : enemy.maxHp;
        enemy.hp = Math.min(maxHp, enemy.hp + (intent.healAmount ?? 0));
        break;
      }
      case 'summon': {
        if (intent.summonId) {
          const summon = this.createEnemyInstance(intent.summonId);
          if (summon && this.state.enemies.length < 3) {
            this.state.enemies.push(summon);
            this.emit('enemy-summoned', summon);
          }
        }
        break;
      }
    }
  }

  private dealDamageToPlayer(damage: number): void {
    const vuln = this.state.playerStatuses.get('vulnerable') ?? 0;
    let finalDmg = vuln > 0 ? Math.floor(damage * 1.5) : damage;

    const weak = this.state.enemies[0]?.statuses.get('weakness') ?? 0;
    if (weak > 0) finalDmg = Math.floor(finalDmg * 0.75);

    if (this.state.playerBlock > 0) {
      const blocked = Math.min(this.state.playerBlock, finalDmg);
      this.state.playerBlock -= blocked;
      finalDmg -= blocked;
    }

    this.state.playerHp -= Math.max(0, finalDmg);
  }

  private applyStatusToPlayer(statusId: StatusEffectId, stacks: number): void {
    const current = this.state.playerStatuses.get(statusId) ?? 0;
    this.state.playerStatuses.set(statusId, current + stacks);
  }

  private applyStatusToEnemy(enemy: EnemyInstance, statusId: StatusEffectId, stacks: number): void {
    const current = enemy.statuses.get(statusId) ?? 0;
    enemy.statuses.set(statusId, current + stacks);
  }

  private tickPlayerCounterStatuses(): void {
    for (const id of ['weakness', 'vulnerable', 'freeze'] as StatusEffectId[]) {
      const val = this.state.playerStatuses.get(id) ?? 0;
      if (val > 0) {
        this.state.playerStatuses.set(id, val - 1);
        if (val - 1 <= 0) this.state.playerStatuses.delete(id);
      }
    }
  }

  private tickEnemyStatuses(enemy: EnemyInstance): void {
    for (const id of ['weakness', 'vulnerable', 'burn'] as StatusEffectId[]) {
      const val = enemy.statuses.get(id) ?? 0;
      if (val > 0) {
        if (id === 'burn') enemy.hp -= val;
        enemy.statuses.set(id, val - 1);
        if (val - 1 <= 0) enemy.statuses.delete(id);
      }
    }
  }

  private rollNextIntent(enemy: EnemyInstance): void {
    const def = ENEMY_BY_ID.get(enemy.defId);
    if (!def) return;

    const pattern = def.pattern;

    switch (pattern.type) {
      case 'cycle': {
        enemy.currentMoveIndex = (enemy.currentMoveIndex + 1) % pattern.moves.length;
        enemy.currentIntent = pattern.moves[enemy.currentMoveIndex].intent;
        break;
      }
      case 'random': {
        const totalWeight = pattern.moves.reduce((s, m) => s + m.weight, 0);
        let roll = Math.random() * totalWeight;
        for (const wm of pattern.moves) {
          roll -= wm.weight;
          if (roll <= 0) {
            enemy.currentIntent = wm.move.intent;
            break;
          }
        }
        break;
      }
      case 'conditional': {
        let matched = false;
        for (const rule of pattern.rules) {
          if (this.evaluateCondition(rule.condition, rule.value, enemy)) {
            enemy.currentIntent = rule.move.intent;
            matched = true;
            break;
          }
        }
        if (!matched) {
          enemy.currentIntent = pattern.defaultMove.intent;
        }
        break;
      }
    }

    enemy.turnCount++;
  }

  private evaluateCondition(condition: string, value: number | string, enemy: EnemyInstance): boolean {
    switch (condition) {
      case 'hp_above_pct': {
        const pct = (enemy.hp / enemy.maxHp) * 100;
        return pct > (value as number);
      }
      case 'hp_below_pct': {
        const pct = (enemy.hp / enemy.maxHp) * 100;
        return pct <= (value as number);
      }
      case 'every_n_turns':
        return enemy.turnCount > 0 && enemy.turnCount % (value as number) === 0;
      case 'player_has_status':
        return (this.state.playerStatuses.get(value as StatusEffectId) ?? 0) > 0;
      case 'has_block':
        return enemy.block > (value as number);
      default:
        return false;
    }
  }

  private createEnemyInstance(defId: string): EnemyInstance | null {
    const def = ENEMY_BY_ID.get(defId);
    if (!def) return null;

    const hp = def.hpRange[0] + Math.floor(Math.random() * (def.hpRange[1] - def.hpRange[0] + 1));

    const instance: EnemyInstance = {
      defId,
      name: def.name,
      hp,
      maxHp: hp,
      block: 0,
      statuses: new Map(),
      currentMoveIndex: 0,
      turnCount: 0,
      currentIntent: { type: 'unknown' },
    };

    // Set first intent
    this.rollFirstIntent(instance, def);
    return instance;
  }

  private rollFirstIntent(enemy: EnemyInstance, def: EnemyDef): void {
    switch (def.pattern.type) {
      case 'cycle':
        enemy.currentIntent = def.pattern.moves[0].intent;
        break;
      case 'random': {
        const wm = pickRandom(def.pattern.moves);
        enemy.currentIntent = wm.move.intent;
        break;
      }
      case 'conditional':
        enemy.currentIntent = def.pattern.defaultMove.intent;
        break;
    }
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
}
