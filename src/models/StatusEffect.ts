export type StackType = 'counter' | 'permanent';

export interface StatusEffect {
  id: string;
  name: string;
  stackType: StackType;
  stacks: number;
  description: string;
  color: number;
}

export type StatusEffectId =
  | 'burn'
  | 'poison'
  | 'freeze'
  | 'strength'
  | 'armor'
  | 'thorns'
  | 'weakness'
  | 'vulnerable'
  | 'regen';

export interface StatusEffectDef {
  id: StatusEffectId;
  name: string;
  stackType: StackType;
  description: string;
  color: number;
  isDebuff: boolean;
}

export const STATUS_EFFECTS: Record<StatusEffectId, StatusEffectDef> = {
  burn: { id: 'burn', name: 'Burn', stackType: 'counter', description: 'Take X damage at turn end, decreases by 1', color: 0xff4500, isDebuff: true },
  poison: { id: 'poison', name: 'Poison', stackType: 'permanent', description: 'Take X damage at turn start', color: 0x00ff00, isDebuff: true },
  freeze: { id: 'freeze', name: 'Freeze', stackType: 'counter', description: 'Skip next X actions', color: 0x00bfff, isDebuff: true },
  strength: { id: 'strength', name: 'Strength', stackType: 'permanent', description: '+X damage to all attacks', color: 0xff6347, isDebuff: false },
  armor: { id: 'armor', name: 'Armor', stackType: 'counter', description: 'Block persists for X turns', color: 0x708090, isDebuff: false },
  thorns: { id: 'thorns', name: 'Thorns', stackType: 'permanent', description: 'Deal X damage when hit', color: 0x8b4513, isDebuff: false },
  weakness: { id: 'weakness', name: 'Weakness', stackType: 'counter', description: 'Deal 25% less damage for X turns', color: 0x9e9e9e, isDebuff: true },
  vulnerable: { id: 'vulnerable', name: 'Vulnerable', stackType: 'counter', description: 'Take 50% more damage for X turns', color: 0xffa500, isDebuff: true },
  regen: { id: 'regen', name: 'Regen', stackType: 'counter', description: 'Heal X HP at turn start, decreases by 1', color: 0x4caf50, isDebuff: false },
};
