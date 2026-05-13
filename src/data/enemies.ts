import { EnemyDef } from '@/models/Enemy';

// ============================================================
// ACT 1: FIRE DUNGEON
// ============================================================

const FIRE_BASIC: EnemyDef[] = [
  {
    id: 'ember_wisp', name: 'Ember Wisp', tier: 'basic', hpRange: [18, 22], color: 0xff6b35,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 6 } },
      { intent: { type: 'attack', damage: 8 } },
    ]},
  },
  {
    id: 'flame_hound', name: 'Flame Hound', tier: 'basic', hpRange: [28, 32], color: 0xe94560,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'multi_attack', damage: 4, hits: 2 } },
      { intent: { type: 'buff', statusId: 'strength', statusStacks: 2 } },
    ]},
  },
  {
    id: 'lava_slug', name: 'Lava Slug', tier: 'basic', hpRange: [22, 28], color: 0xb22222,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'block', block: 5 } },
      { intent: { type: 'attack', damage: 10 } },
    ]},
  },
  {
    id: 'cinder_imp', name: 'Cinder Imp', tier: 'basic', hpRange: [15, 18], color: 0xcd5c5c,
    pattern: { type: 'random', moves: [
      { weight: 60, move: { intent: { type: 'attack', damage: 5 } } },
      { weight: 30, move: { intent: { type: 'debuff', statusId: 'vulnerable', statusStacks: 1 } } },
      { weight: 10, move: { intent: { type: 'attack', damage: 10 } } },
    ]},
  },
  {
    id: 'smoke_wisp', name: 'Smoke Wisp', tier: 'basic', hpRange: [12, 15], color: 0x888888,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'debuff', statusId: 'weakness', statusStacks: 1 } },
      { intent: { type: 'attack', damage: 7 } },
    ]},
  },
];

const FIRE_ELITE: EnemyDef[] = [
  {
    id: 'magma_golem', name: 'Magma Golem', tier: 'elite', hpRange: [50, 60], color: 0xcc4400,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'attack', damage: 12 } }, rules: [
      { condition: 'hp_below_pct', value: 50, move: { intent: { type: 'attack', damage: 8 } } },
      { condition: 'every_n_turns', value: 3, move: { intent: { type: 'buff', statusId: 'strength', statusStacks: 3 } } },
    ]},
  },
  {
    id: 'furnace_guardian', name: 'Furnace Guardian', tier: 'elite', hpRange: [45, 55], color: 0xff4500,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 8 } },
      { intent: { type: 'block', block: 10 } },
      { intent: { type: 'multi_attack', damage: 6, hits: 3 } },
    ]},
  },
];

const FIRE_BOSS: EnemyDef[] = [
  {
    id: 'phoenix', name: 'Phoenix', tier: 'boss', hpRange: [75, 85], color: 0xffd700,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'multi_attack', damage: 8, hits: 2 } }, rules: [
      { condition: 'every_n_turns', value: 3, move: { intent: { type: 'heal', healAmount: 10 } } },
      { condition: 'hp_below_pct', value: 40, move: { intent: { type: 'attack', damage: 15 } } },
    ]},
  },
];

// ============================================================
// ACT 2: WATER DUNGEON
// ============================================================

const WATER_BASIC: EnemyDef[] = [
  {
    id: 'tide_sprite', name: 'Tide Sprite', tier: 'basic', hpRange: [20, 24], color: 0x64b5f6,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 7 } },
      { intent: { type: 'block', block: 8 } },
    ]},
  },
  {
    id: 'reef_crab', name: 'Reef Crab', tier: 'basic', hpRange: [32, 38], color: 0xff7f50,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'block', block: 10 } },
      { intent: { type: 'attack', damage: 5 } },
    ]},
  },
  {
    id: 'deep_angler', name: 'Deep Angler', tier: 'basic', hpRange: [25, 30], color: 0x0d47a1,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 10 } },
      { intent: { type: 'multi_attack', damage: 4, hits: 3 } },
    ]},
  },
  {
    id: 'jellyfish', name: 'Jellyfish', tier: 'basic', hpRange: [14, 18], color: 0xce93d8,
    pattern: { type: 'random', moves: [
      { weight: 50, move: { intent: { type: 'attack', damage: 4 } } },
      { weight: 50, move: { intent: { type: 'block', block: 6 } } },
    ]},
  },
  {
    id: 'barnacle', name: 'Barnacle', tier: 'basic', hpRange: [35, 40], color: 0x708090,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'block', block: 12 } },
      { intent: { type: 'buff', statusId: 'thorns', statusStacks: 2 } },
      { intent: { type: 'attack', damage: 6 } },
    ]},
  },
];

const WATER_ELITE: EnemyDef[] = [
  {
    id: 'leviathan_spawn', name: 'Leviathan Spawn', tier: 'elite', hpRange: [60, 70], color: 0x1565c0,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'attack', damage: 10 } }, rules: [
      { condition: 'every_n_turns', value: 2, move: { intent: { type: 'block', block: 12 } } },
      { condition: 'player_has_status', value: 'weakness', move: { intent: { type: 'multi_attack', damage: 7, hits: 3 } } },
    ]},
  },
  {
    id: 'coral_witch', name: 'Coral Witch', tier: 'elite', hpRange: [50, 58], color: 0x00897b,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'debuff', statusId: 'vulnerable', statusStacks: 2 } },
      { intent: { type: 'attack', damage: 14 } },
      { intent: { type: 'heal', healAmount: 8 } },
    ]},
  },
];

const WATER_BOSS: EnemyDef[] = [
  {
    id: 'kraken', name: 'Kraken', tier: 'boss', hpRange: [95, 105], color: 0x0d47a1,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'multi_attack', damage: 6, hits: 3 } }, rules: [
      { condition: 'every_n_turns', value: 2, move: { intent: { type: 'attack', damage: 12 } } },
      { condition: 'hp_below_pct', value: 50, move: { intent: { type: 'multi_attack', damage: 8, hits: 4 } } },
    ]},
  },
];

// ============================================================
// ACT 3: EARTH DUNGEON
// ============================================================

const EARTH_BASIC: EnemyDef[] = [
  {
    id: 'stone_sentinel', name: 'Stone Sentinel', tier: 'basic', hpRange: [32, 38], color: 0x708090,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'block', block: 8 } },
      { intent: { type: 'attack', damage: 8 } },
    ]},
  },
  {
    id: 'root_creeper', name: 'Root Creeper', tier: 'basic', hpRange: [28, 32], color: 0x6b8e23,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'buff', statusId: 'strength', statusStacks: 1 } },
      { intent: { type: 'attack', damage: 5 } },
    ]},
  },
  {
    id: 'crystal_bat', name: 'Crystal Bat', tier: 'basic', hpRange: [18, 22], color: 0x98fb98,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'multi_attack', damage: 5, hits: 3 } },
      { intent: { type: 'attack', damage: 8 } },
    ]},
  },
  {
    id: 'mud_golem', name: 'Mud Golem', tier: 'basic', hpRange: [40, 45], color: 0xa0522d,
    pattern: { type: 'random', moves: [
      { weight: 40, move: { intent: { type: 'block', block: 12 } } },
      { weight: 40, move: { intent: { type: 'attack', damage: 9 } } },
      { weight: 20, move: { intent: { type: 'buff', statusId: 'armor', statusStacks: 2 } } },
    ]},
  },
  {
    id: 'vine_trap', name: 'Vine Trap', tier: 'basic', hpRange: [20, 25], color: 0x228b22,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'debuff', statusId: 'vulnerable', statusStacks: 1 } },
      { intent: { type: 'attack', damage: 12 } },
      { intent: { type: 'attack', damage: 6 } },
    ]},
  },
];

const EARTH_ELITE: EnemyDef[] = [
  {
    id: 'iron_titan', name: 'Iron Titan', tier: 'elite', hpRange: [75, 85], color: 0x556b2f,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'attack', damage: 18 } }, rules: [
      { condition: 'has_block', value: 0, move: { intent: { type: 'block', block: 15 } } },
      { condition: 'every_n_turns', value: 4, move: { intent: { type: 'buff', statusId: 'strength', statusStacks: 4 } } },
    ]},
  },
  {
    id: 'ancient_treant', name: 'Ancient Treant', tier: 'elite', hpRange: [65, 75], color: 0x2e7d32,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'buff', statusId: 'thorns', statusStacks: 3 } },
      { intent: { type: 'block', block: 20 } },
      { intent: { type: 'multi_attack', damage: 10, hits: 2 } },
    ]},
  },
];

const EARTH_BOSS: EnemyDef[] = [
  {
    id: 'world_wyrm', name: 'World Wyrm', tier: 'boss', hpRange: [115, 125], color: 0x33691e,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'attack', damage: 10 } }, rules: [
      { condition: 'every_n_turns', value: 2, move: { intent: { type: 'block', block: 20 } } },
      { condition: 'hp_below_pct', value: 40, move: { intent: { type: 'multi_attack', damage: 12, hits: 2 } } },
    ]},
  },
];

// ============================================================
// ACT 4: VOID DUNGEON
// ============================================================

const VOID_BASIC: EnemyDef[] = [
  {
    id: 'shadow_phantom', name: 'Shadow Phantom', tier: 'basic', hpRange: [22, 28], color: 0x9370db,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'debuff', statusId: 'weakness', statusStacks: 1 } },
      { intent: { type: 'attack', damage: 9 } },
    ]},
  },
  {
    id: 'rift_walker', name: 'Rift Walker', tier: 'basic', hpRange: [30, 35], color: 0x8a2be2,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 7 } },
      { intent: { type: 'debuff', statusId: 'vulnerable', statusStacks: 1 } },
      { intent: { type: 'attack', damage: 14 } },
    ]},
  },
  {
    id: 'null_construct', name: 'Null Construct', tier: 'basic', hpRange: [38, 44], color: 0x4b0082,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'block', block: 10 } },
      { intent: { type: 'multi_attack', damage: 6, hits: 2 } },
    ]},
  },
  {
    id: 'entropy_shade', name: 'Entropy Shade', tier: 'basic', hpRange: [16, 20], color: 0x663399,
    pattern: { type: 'random', moves: [
      { weight: 40, move: { intent: { type: 'attack', damage: 5 } } },
      { weight: 30, move: { intent: { type: 'debuff', statusId: 'weakness', statusStacks: 1 } } },
      { weight: 30, move: { intent: { type: 'attack', damage: 8 } } },
    ]},
  },
  {
    id: 'void_leech', name: 'Void Leech', tier: 'basic', hpRange: [25, 30], color: 0x800080,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 6 } },
      { intent: { type: 'attack', damage: 10 } },
    ]},
  },
];

const VOID_ELITE: EnemyDef[] = [
  {
    id: 'void_herald', name: 'Void Herald', tier: 'elite', hpRange: [85, 95], color: 0x4a148c,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'debuff', statusId: 'weakness', statusStacks: 2 } }, rules: [
      { condition: 'every_n_turns', value: 2, move: { intent: { type: 'multi_attack', damage: 10, hits: 2 } } },
      { condition: 'player_has_status', value: 'vulnerable', move: { intent: { type: 'attack', damage: 18 } } },
    ]},
  },
  {
    id: 'dimension_ripper', name: 'Dimension Ripper', tier: 'elite', hpRange: [70, 80], color: 0x9400d3,
    pattern: { type: 'cycle', moves: [
      { intent: { type: 'attack', damage: 8 } },
      { intent: { type: 'debuff', statusId: 'vulnerable', statusStacks: 2 } },
      { intent: { type: 'multi_attack', damage: 12, hits: 2 } },
    ]},
  },
];

const VOID_BOSS: EnemyDef[] = [
  {
    id: 'the_null', name: 'The Null', tier: 'boss', hpRange: [140, 160], color: 0x2e003e,
    pattern: { type: 'conditional', defaultMove: { intent: { type: 'multi_attack', damage: 8, hits: 3 } }, rules: [
      { condition: 'every_n_turns', value: 3, move: { intent: { type: 'debuff', statusId: 'weakness', statusStacks: 2 } } },
      { condition: 'hp_below_pct', value: 60, move: { intent: { type: 'summon', summonId: 'shadow_phantom' } } },
      { condition: 'hp_below_pct', value: 30, move: { intent: { type: 'attack', damage: 20 } } },
    ]},
  },
];

// ============================================================
// EXPORTS
// ============================================================

export const ALL_ENEMIES: EnemyDef[] = [
  ...FIRE_BASIC, ...FIRE_ELITE, ...FIRE_BOSS,
  ...WATER_BASIC, ...WATER_ELITE, ...WATER_BOSS,
  ...EARTH_BASIC, ...EARTH_ELITE, ...EARTH_BOSS,
  ...VOID_BASIC, ...VOID_ELITE, ...VOID_BOSS,
];

export const ENEMY_BY_ID = new Map(ALL_ENEMIES.map((e) => [e.id, e]));

export interface ActDef {
  id: string;
  name: string;
  basicEnemyIds: string[];
  eliteEnemyIds: string[];
  bossId: string;
  color: number;
}

export const ACTS: ActDef[] = [
  { id: 'fire', name: 'Fire Dungeon', basicEnemyIds: FIRE_BASIC.map((e) => e.id), eliteEnemyIds: FIRE_ELITE.map((e) => e.id), bossId: 'phoenix', color: 0xe94560 },
  { id: 'water', name: 'Water Dungeon', basicEnemyIds: WATER_BASIC.map((e) => e.id), eliteEnemyIds: WATER_ELITE.map((e) => e.id), bossId: 'kraken', color: 0x2196f3 },
  { id: 'earth', name: 'Earth Dungeon', basicEnemyIds: EARTH_BASIC.map((e) => e.id), eliteEnemyIds: EARTH_ELITE.map((e) => e.id), bossId: 'world_wyrm', color: 0x4caf50 },
  { id: 'void', name: 'Void Dungeon', basicEnemyIds: VOID_BASIC.map((e) => e.id), eliteEnemyIds: VOID_ELITE.map((e) => e.id), bossId: 'the_null', color: 0x9c27b0 },
];
