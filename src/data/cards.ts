import { Card } from '@/models/Card';
import { OreType, Rarity } from '@/models/types';

// ============================================================
// STRIKE & DEFEND (starter cards, colorless)
// ============================================================

const STARTER_CARDS: Card[] = [
  {
    id: 'strike', materialId: '', name: 'Strike', type: 'attack', cost: 1,
    rarity: Rarity.Common, oreType: 'colorless', keywords: [], upgraded: false,
    effects: [{ type: 'damage', value: 6, target: 'enemy' }],
    description: 'Deal 6 damage.',
  },
  {
    id: 'defend', materialId: '', name: 'Defend', type: 'skill', cost: 1,
    rarity: Rarity.Common, oreType: 'colorless', keywords: [], upgraded: false,
    effects: [{ type: 'block', value: 5, target: 'self' }],
    description: 'Gain 5 Block.',
  },
];

// ============================================================
// COLORLESS UTILITY CARDS
// ============================================================

const COLORLESS_CARDS: Card[] = [
  {
    id: 'cl_adrenaline', materialId: '', name: 'Adrenaline', type: 'skill', cost: 0,
    rarity: Rarity.Rare, oreType: 'colorless', keywords: ['exhaust'], upgraded: false,
    effects: [{ type: 'gain_energy', value: 2, target: 'self' }, { type: 'draw', value: 2, target: 'self' }],
    description: 'Gain 2 Energy. Draw 2. Exhaust.',
  },
  {
    id: 'cl_bandage', materialId: '', name: 'Bandage', type: 'skill', cost: 0,
    rarity: Rarity.Common, oreType: 'colorless', keywords: ['exhaust'], upgraded: false,
    effects: [{ type: 'heal', value: 5, target: 'self' }],
    description: 'Heal 5 HP. Exhaust.',
  },
  {
    id: 'cl_insight', materialId: '', name: 'Insight', type: 'skill', cost: 0,
    rarity: Rarity.Common, oreType: 'colorless', keywords: ['retain'], upgraded: false,
    effects: [{ type: 'draw', value: 2, target: 'self' }],
    description: 'Draw 2 cards. Retain.',
  },
  {
    id: 'cl_swift_strike', materialId: '', name: 'Swift Strike', type: 'attack', cost: 0,
    rarity: Rarity.Common, oreType: 'colorless', keywords: [], upgraded: false,
    effects: [{ type: 'damage', value: 3, target: 'enemy' }],
    description: 'Deal 3 damage.',
  },
  {
    id: 'cl_blind', materialId: '', name: 'Blind', type: 'skill', cost: 1,
    rarity: Rarity.Uncommon, oreType: 'colorless', keywords: [], upgraded: false,
    effects: [{ type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'weakness' }],
    description: 'Apply 2 Weakness to ALL enemies.',
  },
  {
    id: 'cl_trip', materialId: '', name: 'Trip', type: 'skill', cost: 1,
    rarity: Rarity.Uncommon, oreType: 'colorless', keywords: [], upgraded: false,
    effects: [{ type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'vulnerable' }],
    description: 'Apply 2 Vulnerable to ALL enemies.',
  },
  {
    id: 'cl_shiv', materialId: '', name: 'Shiv', type: 'attack', cost: 0,
    rarity: Rarity.Common, oreType: 'colorless', keywords: ['exhaust', 'ethereal'], upgraded: false,
    effects: [{ type: 'damage', value: 4, target: 'enemy' }],
    description: 'Deal 4 damage. Ethereal. Exhaust.',
  },
  {
    id: 'cl_curse', materialId: '', name: 'Curse', type: 'skill', cost: -1,
    rarity: Rarity.Common, oreType: 'colorless', keywords: ['ethereal'], upgraded: false,
    effects: [],
    description: 'Unplayable. Ethereal.',
  },
];

// ============================================================
// HELPER: Create 3 variants from a material definition
// ============================================================

interface MatCardDef {
  materialId: string;
  name: string;
  oreType: OreType;
  rarity: Rarity;
  attack: { cost: number; effects: Card['effects']; desc: string; keywords?: Card['keywords'] };
  skill: { cost: number; effects: Card['effects']; desc: string; keywords?: Card['keywords'] };
  power: { cost: number; effects: Card['effects']; desc: string; keywords?: Card['keywords'] };
}

function createVariants(def: MatCardDef): Card[] {
  return [
    {
      id: `${def.materialId}_atk`, materialId: def.materialId, name: `${def.name}`, type: 'attack',
      cost: def.attack.cost, rarity: def.rarity, oreType: def.oreType, upgraded: false,
      effects: def.attack.effects, keywords: def.attack.keywords ?? [], description: def.attack.desc,
    },
    {
      id: `${def.materialId}_skl`, materialId: def.materialId, name: `${def.name}`, type: 'skill',
      cost: def.skill.cost, rarity: def.rarity, oreType: def.oreType, upgraded: false,
      effects: def.skill.effects, keywords: def.skill.keywords ?? [], description: def.skill.desc,
    },
    {
      id: `${def.materialId}_pwr`, materialId: def.materialId, name: `${def.name}`, type: 'power',
      cost: def.power.cost, rarity: def.rarity, oreType: def.oreType, upgraded: false,
      effects: def.power.effects, keywords: def.power.keywords ?? [], description: def.power.desc,
    },
  ];
}

// ============================================================
// FIRE CARDS (11 materials × 3 variants = 33 cards)
// ============================================================

const FIRE_DEFS: MatCardDef[] = [
  // --- Common ---
  { materialId: 'fire_ember_dust', name: 'Ember Dust', oreType: OreType.Fire, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 7, target: 'enemy' }], desc: 'Deal 7 damage.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 4, target: 'self' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'burn' }], desc: 'Gain 4 Block. Apply 1 Burn.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'strength' }], desc: 'Gain 1 Strength.' },
  },
  { materialId: 'fire_ash_flake', name: 'Ash Flake', oreType: OreType.Fire, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 4, target: 'enemy' }, { type: 'damage', value: 4, target: 'enemy' }], desc: 'Deal 4 damage twice.' },
    skill: { cost: 0, effects: [{ type: 'draw', value: 1, target: 'self' }], desc: 'Draw 1 card.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'thorns' }], desc: 'Gain 1 Thorns.' },
  },
  { materialId: 'fire_cinder_shard', name: 'Cinder Shard', oreType: OreType.Fire, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 5, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'burn' }], desc: 'Deal 5 damage. Apply 1 Burn.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 6, target: 'self' }], desc: 'Gain 6 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'enemy', statusId: 'burn' }], desc: 'Apply 2 Burn to an enemy.' },
  },
  // --- Uncommon ---
  { materialId: 'fire_flame_crystal', name: 'Flame Crystal', oreType: OreType.Fire, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 4, target: 'enemy' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'burn' }], desc: 'Deal 4 damage. Apply 2 Burn.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 4, target: 'self' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'burn' }], desc: 'Gain 4 Block. Apply 1 Burn.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'burn' }], desc: 'Gain 1 Strength. Apply 1 Burn.' },
  },
  { materialId: 'fire_magma_chunk', name: 'Magma Chunk', oreType: OreType.Fire, rarity: Rarity.Uncommon,
    attack: { cost: 2, effects: [{ type: 'damage', value: 12, target: 'enemy' }], desc: 'Deal 12 damage.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 8, target: 'self' }], desc: 'Gain 8 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }], desc: 'Gain 2 Strength.' },
  },
  { materialId: 'fire_blaze_ore', name: 'Blaze Ore', oreType: OreType.Fire, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 3, target: 'enemy' }, { type: 'damage', value: 3, target: 'enemy' }, { type: 'damage', value: 3, target: 'enemy' }], desc: 'Deal 3 damage three times.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 5, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 5 Block. Draw 1.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 2, target: 'enemy', statusId: 'burn' }], desc: 'Apply 2 Burn.' },
  },
  // --- Rare ---
  { materialId: 'fire_molten_shard', name: 'Molten Shard', oreType: OreType.Fire, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'aoe_damage', value: 10, target: 'all_enemies' }], desc: 'Deal 10 damage to ALL enemies.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 12, target: 'self' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'burn' }], desc: 'Gain 12 Block. Apply 2 Burn.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'strength' }], desc: 'Gain 3 Strength.' },
  },
  { materialId: 'fire_inferno_gem', name: 'Inferno Gem', oreType: OreType.Fire, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 8, target: 'enemy' }, { type: 'apply_status', value: 3, target: 'enemy', statusId: 'burn' }], desc: 'Deal 8 damage. Apply 3 Burn.' },
    skill: { cost: 1, effects: [{ type: 'apply_status', value: 3, target: 'all_enemies', statusId: 'burn' }], desc: 'Apply 3 Burn to ALL enemies.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'thorns' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }], desc: 'Gain 2 Thorns and 2 Strength.' },
  },
  // --- Epic ---
  { materialId: 'fire_solar_core', name: 'Solar Core', oreType: OreType.Fire, rarity: Rarity.Epic,
    attack: { cost: 2, effects: [{ type: 'damage', value: 8, target: 'enemy' }, { type: 'gain_energy', value: 1, target: 'self' }], desc: 'Deal 8 damage. Gain 1 Energy.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 10, target: 'self' }, { type: 'gain_energy', value: 1, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 10 Block. Gain 1 Energy. Draw 1.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 4, target: 'self', statusId: 'strength' }], desc: 'Gain 4 Strength.', keywords: ['exhaust'] },
  },
  { materialId: 'fire_dragon_heart', name: 'Dragon Heart', oreType: OreType.Fire, rarity: Rarity.Epic,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 15, target: 'all_enemies' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'burn' }], desc: 'Deal 15 damage to ALL enemies. Apply 2 Burn to ALL.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 15, target: 'self' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 15 Block. Gain 2 Armor.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 3, target: 'self', statusId: 'thorns' }], desc: 'Gain 3 Strength and 3 Thorns.' },
  },
  // --- Legendary ---
  { materialId: 'fire_phoenix_core', name: 'Phoenix Core', oreType: OreType.Fire, rarity: Rarity.Legendary,
    attack: { cost: 3, effects: [{ type: 'damage', value: 20, target: 'enemy' }, { type: 'heal', value: 8, target: 'self' }], desc: 'Deal 20 damage. Heal 8 HP.', keywords: ['exhaust'] },
    skill: { cost: 3, effects: [{ type: 'block', value: 20, target: 'self' }, { type: 'heal', value: 10, target: 'self' }], desc: 'Gain 20 Block. Heal 10 HP. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 5, target: 'self', statusId: 'regen' }], desc: 'Gain 5 Regen.', keywords: ['exhaust'] },
  },
];

// ============================================================
// WATER CARDS (11 materials × 3 = 33)
// ============================================================

const WATER_DEFS: MatCardDef[] = [
  // --- Common ---
  { materialId: 'water_dew_drop', name: 'Dew Drop', oreType: OreType.Water, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 5, target: 'enemy' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Deal 5 damage. Draw 1.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 7, target: 'self' }], desc: 'Gain 7 Block.' },
    power: { cost: 1, effects: [{ type: 'draw', value: 1, target: 'self' }], desc: 'Draw 1 extra card each turn.' },
  },
  { materialId: 'water_sea_salt', name: 'Sea Salt', oreType: OreType.Water, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 6, target: 'enemy' }], desc: 'Deal 6 damage.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 5, target: 'self' }, { type: 'block', value: 5, target: 'self' }], desc: 'Gain 5 Block twice.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'armor' }], desc: 'Gain 1 Armor.' },
  },
  { materialId: 'water_coral_bit', name: 'Coral Bit', oreType: OreType.Water, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 4, target: 'enemy' }, { type: 'block', value: 3, target: 'self' }], desc: 'Deal 4 damage. Gain 3 Block.' },
    skill: { cost: 0, effects: [{ type: 'block', value: 3, target: 'self' }], desc: 'Gain 3 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'thorns' }], desc: 'Gain 1 Thorns.' },
  },
  // --- Uncommon ---
  { materialId: 'water_frost_gem', name: 'Frost Gem', oreType: OreType.Water, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 6, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'freeze' }], desc: 'Deal 6 damage. Apply 1 Freeze.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 12, target: 'self' }], desc: 'Gain 12 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'freeze' }], desc: 'Apply 1 Weakness and 1 Freeze.' },
  },
  { materialId: 'water_tide_stone', name: 'Tide Stone', oreType: OreType.Water, rarity: Rarity.Uncommon,
    attack: { cost: 2, effects: [{ type: 'damage', value: 10, target: 'enemy' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Deal 10 damage. Draw 1.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 8, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 8 Block. Draw 1.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 2 Armor.' },
  },
  { materialId: 'water_wave_crystal', name: 'Wave Crystal', oreType: OreType.Water, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 7, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }], desc: 'Deal 7 damage. Apply 1 Weakness.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 6, target: 'self' }, { type: 'heal', value: 3, target: 'self' }], desc: 'Gain 6 Block. Heal 3 HP.' },
    power: { cost: 1, effects: [{ type: 'heal', value: 2, target: 'self' }], desc: 'Heal 2 HP each turn.' },
  },
  // --- Rare ---
  { materialId: 'water_deep_pearl', name: 'Deep Pearl', oreType: OreType.Water, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 8, target: 'enemy' }, { type: 'heal', value: 5, target: 'self' }], desc: 'Deal 8 damage. Heal 5 HP.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 15, target: 'self' }], desc: 'Gain 15 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'regen' }], desc: 'Gain 3 Regen.' },
  },
  { materialId: 'water_glacier_heart', name: 'Glacier Heart', oreType: OreType.Water, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 9, target: 'enemy' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'freeze' }], desc: 'Deal 9 damage. Apply 2 Freeze.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 10, target: 'self' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 10 Block. Gain 2 Armor.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'freeze' }], desc: 'Apply 1 Freeze to ALL enemies each turn.' },
  },
  // --- Epic ---
  { materialId: 'water_ocean_tear', name: 'Ocean Tear', oreType: OreType.Water, rarity: Rarity.Epic,
    attack: { cost: 2, effects: [{ type: 'damage', value: 12, target: 'enemy' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'weakness' }], desc: 'Deal 12 damage. Apply 2 Weakness.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 18, target: 'self' }, { type: 'draw', value: 2, target: 'self' }], desc: 'Gain 18 Block. Draw 2.' },
    power: { cost: 3, effects: [{ type: 'draw', value: 2, target: 'self' }], desc: 'Draw 2 extra cards each turn.', keywords: ['exhaust'] },
  },
  { materialId: 'water_leviathan_scale', name: 'Leviathan Scale', oreType: OreType.Water, rarity: Rarity.Epic,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 12, target: 'all_enemies' }, { type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'freeze' }], desc: 'Deal 12 damage to ALL. Apply 1 Freeze to ALL.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 20, target: 'self' }, { type: 'apply_status', value: 3, target: 'self', statusId: 'armor' }], desc: 'Gain 20 Block. Gain 3 Armor.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'thorns' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 3 Thorns and 2 Armor.' },
  },
  // --- Legendary ---
  { materialId: 'water_abyssal_pearl', name: 'Abyssal Pearl', oreType: OreType.Water, rarity: Rarity.Legendary,
    attack: { cost: 3, effects: [{ type: 'damage', value: 15, target: 'enemy' }, { type: 'apply_status', value: 3, target: 'enemy', statusId: 'freeze' }], desc: 'Deal 15 damage. Apply 3 Freeze.', keywords: ['exhaust'] },
    skill: { cost: 3, effects: [{ type: 'block', value: 30, target: 'self' }], desc: 'Gain 30 Block. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 5, target: 'self', statusId: 'regen' }, { type: 'apply_status', value: 3, target: 'self', statusId: 'armor' }], desc: 'Gain 5 Regen and 3 Armor.', keywords: ['exhaust'] },
  },
];

// ============================================================
// EARTH CARDS (11 materials × 3 = 33)
// ============================================================

const EARTH_DEFS: MatCardDef[] = [
  // --- Common ---
  { materialId: 'earth_clay_fragment', name: 'Clay Fragment', oreType: OreType.Earth, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 4, target: 'enemy' }, { type: 'block', value: 3, target: 'self' }], desc: 'Deal 4 damage. Gain 3 Block.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 7, target: 'self' }], desc: 'Gain 7 Block.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'thorns' }], desc: 'Gain 1 Thorns.' },
  },
  { materialId: 'earth_moss_stone', name: 'Moss Stone', oreType: OreType.Earth, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 6, target: 'enemy' }], desc: 'Deal 6 damage.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 5, target: 'self' }, { type: 'heal', value: 2, target: 'self' }], desc: 'Gain 5 Block. Heal 2 HP.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'regen' }], desc: 'Gain 1 Regen.' },
  },
  { materialId: 'earth_root_fiber', name: 'Root Fiber', oreType: OreType.Earth, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 5, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 5 damage. Apply 1 Vulnerable.' },
    skill: { cost: 0, effects: [{ type: 'block', value: 4, target: 'self' }], desc: 'Gain 4 Block.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'strength' }], desc: 'Gain 1 Strength.' },
  },
  // --- Uncommon ---
  { materialId: 'earth_iron_chunk', name: 'Iron Chunk', oreType: OreType.Earth, rarity: Rarity.Uncommon,
    attack: { cost: 2, effects: [{ type: 'damage', value: 10, target: 'enemy' }, { type: 'block', value: 5, target: 'self' }], desc: 'Deal 10 damage. Gain 5 Block.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 8, target: 'self' }, { type: 'apply_status', value: 1, target: 'self', statusId: 'armor' }], desc: 'Gain 8 Block. Gain 1 Armor.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'thorns' }], desc: 'Gain 2 Thorns.' },
  },
  { materialId: 'earth_jade_shard', name: 'Jade Shard', oreType: OreType.Earth, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 7, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 7 damage. Apply 1 Vulnerable.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 6, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 6 Block. Draw 1.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }], desc: 'Gain 2 Strength.' },
  },
  { materialId: 'earth_amber_piece', name: 'Amber Piece', oreType: OreType.Earth, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 8, target: 'enemy' }], desc: 'Deal 8 damage.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 12, target: 'self' }, { type: 'apply_status', value: 1, target: 'self', statusId: 'armor' }], desc: 'Gain 12 Block. Gain 1 Armor.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 1, target: 'self', statusId: 'thorns' }], desc: 'Gain 1 Strength and 1 Thorns.' },
  },
  // --- Rare ---
  { materialId: 'earth_crystal_vein', name: 'Crystal Vein', oreType: OreType.Earth, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 14, target: 'enemy' }], desc: 'Deal 14 damage.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 16, target: 'self' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 16 Block. Gain 2 Armor.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'thorns' }], desc: 'Gain 3 Thorns.' },
  },
  { materialId: 'earth_titan_bone', name: 'Titan Bone', oreType: OreType.Earth, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 12, target: 'enemy' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 12 damage. Apply 2 Vulnerable.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 10, target: 'self' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }], desc: 'Gain 10 Block. Gain 2 Strength.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 3, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'armor' }], desc: 'Gain 3 Strength and 2 Armor.' },
  },
  // --- Epic ---
  { materialId: 'earth_diamond_seed', name: 'Diamond Seed', oreType: OreType.Earth, rarity: Rarity.Epic,
    attack: { cost: 2, effects: [{ type: 'damage', value: 10, target: 'enemy' }, { type: 'block', value: 10, target: 'self' }], desc: 'Deal 10 damage. Gain 10 Block.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 20, target: 'self' }, { type: 'apply_status', value: 3, target: 'self', statusId: 'armor' }], desc: 'Gain 20 Block. Gain 3 Armor.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 4, target: 'self', statusId: 'strength' }], desc: 'Gain 4 Strength.', keywords: ['exhaust'] },
  },
  { materialId: 'earth_tectonic_heart', name: 'Tectonic Heart', oreType: OreType.Earth, rarity: Rarity.Epic,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 14, target: 'all_enemies' }, { type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Deal 14 damage to ALL. Apply 1 Vulnerable to ALL.' },
    skill: { cost: 3, effects: [{ type: 'block', value: 25, target: 'self' }, { type: 'apply_status', value: 3, target: 'self', statusId: 'thorns' }], desc: 'Gain 25 Block and 3 Thorns. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 4, target: 'self', statusId: 'thorns' }, { type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }], desc: 'Gain 4 Thorns and 2 Strength.' },
  },
  // --- Legendary ---
  { materialId: 'earth_worldstone', name: 'Worldstone', oreType: OreType.Earth, rarity: Rarity.Legendary,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 18, target: 'all_enemies' }, { type: 'block', value: 18, target: 'self' }], desc: 'Deal 18 damage to ALL. Gain 18 Block. Exhaust.', keywords: ['exhaust'] },
    skill: { cost: 3, effects: [{ type: 'block', value: 30, target: 'self' }, { type: 'apply_status', value: 5, target: 'self', statusId: 'armor' }], desc: 'Gain 30 Block and 5 Armor. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 5, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 5, target: 'self', statusId: 'thorns' }], desc: 'Gain 5 Strength and 5 Thorns. Exhaust.', keywords: ['exhaust'] },
  },
];

// ============================================================
// VOID CARDS (11 materials × 3 = 33)
// ============================================================

const VOID_DEFS: MatCardDef[] = [
  // --- Common ---
  { materialId: 'void_shadow_wisp', name: 'Shadow Wisp', oreType: OreType.Void, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 5, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }], desc: 'Deal 5 damage. Apply 1 Weakness.' },
    skill: { cost: 0, effects: [{ type: 'draw', value: 1, target: 'self' }], desc: 'Draw 1 card.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }], desc: 'Apply 1 Weakness.' },
  },
  { materialId: 'void_dark_mote', name: 'Dark Mote', oreType: OreType.Void, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 6, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 6 damage. Apply 1 Vulnerable.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 5, target: 'self' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Gain 5 Block. Apply 1 Vulnerable.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Apply 1 Vulnerable each turn.' },
  },
  { materialId: 'void_echo_shard', name: 'Echo Shard', oreType: OreType.Void, rarity: Rarity.Common,
    attack: { cost: 1, effects: [{ type: 'damage', value: 3, target: 'enemy' }, { type: 'damage', value: 3, target: 'enemy' }], desc: 'Deal 3 damage twice.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 4, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 4 Block. Draw 1.' },
    power: { cost: 1, effects: [{ type: 'apply_status', value: 1, target: 'enemy', statusId: 'poison' }], desc: 'Apply 1 Poison.' },
  },
  // --- Uncommon ---
  { materialId: 'void_dark_essence', name: 'Dark Essence', oreType: OreType.Void, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 8, target: 'enemy' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 8 damage. Apply 1 Weakness and 1 Vulnerable.' },
    skill: { cost: 1, effects: [{ type: 'apply_status', value: 2, target: 'enemy', statusId: 'weakness' }], desc: 'Apply 2 Weakness.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'weakness' }], desc: 'Apply 1 Weakness to ALL enemies each turn.' },
  },
  { materialId: 'void_phase_crystal', name: 'Phase Crystal', oreType: OreType.Void, rarity: Rarity.Uncommon,
    attack: { cost: 1, effects: [{ type: 'damage', value: 7, target: 'enemy' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Deal 7 damage. Draw 1.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 8, target: 'self' }, { type: 'draw', value: 1, target: 'self' }], desc: 'Gain 8 Block. Draw 1.' },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'enemy', statusId: 'poison' }], desc: 'Apply 2 Poison.' },
  },
  { materialId: 'void_entropy_dust', name: 'Entropy Dust', oreType: OreType.Void, rarity: Rarity.Uncommon,
    attack: { cost: 0, effects: [{ type: 'damage', value: 4, target: 'enemy' }], desc: 'Deal 4 damage.', keywords: ['exhaust'] },
    skill: { cost: 0, effects: [{ type: 'draw', value: 2, target: 'self' }], desc: 'Draw 2. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 2, effects: [{ type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Apply 1 Vulnerable to ALL enemies each turn.' },
  },
  // --- Rare ---
  { materialId: 'void_nightmare_gem', name: 'Nightmare Gem', oreType: OreType.Void, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'damage', value: 10, target: 'enemy' }, { type: 'apply_status', value: 3, target: 'enemy', statusId: 'poison' }], desc: 'Deal 10 damage. Apply 3 Poison.' },
    skill: { cost: 2, effects: [{ type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'weakness' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Apply 2 Weakness and 2 Vulnerable to ALL.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'poison' }], desc: 'Apply 2 Poison to ALL enemies each turn.' },
  },
  { materialId: 'void_rift_stone', name: 'Rift Stone', oreType: OreType.Void, rarity: Rarity.Rare,
    attack: { cost: 2, effects: [{ type: 'aoe_damage', value: 8, target: 'all_enemies' }, { type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'weakness' }], desc: 'Deal 8 damage to ALL. Apply 1 Weakness to ALL.' },
    skill: { cost: 1, effects: [{ type: 'block', value: 10, target: 'self' }, { type: 'apply_status', value: 1, target: 'enemy', statusId: 'weakness' }], desc: 'Gain 10 Block. Apply 1 Weakness.' },
    power: { cost: 2, effects: [{ type: 'gain_energy', value: 1, target: 'self' }], desc: 'Gain 1 extra Energy each turn.' },
  },
  // --- Epic ---
  { materialId: 'void_oblivion_shard', name: 'Oblivion Shard', oreType: OreType.Void, rarity: Rarity.Epic,
    attack: { cost: 2, effects: [{ type: 'damage', value: 15, target: 'enemy' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'weakness' }, { type: 'apply_status', value: 2, target: 'enemy', statusId: 'vulnerable' }], desc: 'Deal 15 damage. Apply 2 Weakness and 2 Vulnerable.' },
    skill: { cost: 2, effects: [{ type: 'block', value: 15, target: 'self' }, { type: 'apply_status', value: 3, target: 'enemy', statusId: 'poison' }], desc: 'Gain 15 Block. Apply 3 Poison.' },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 3, target: 'all_enemies', statusId: 'poison' }, { type: 'apply_status', value: 1, target: 'all_enemies', statusId: 'weakness' }], desc: 'Apply 3 Poison and 1 Weakness to ALL each turn. Exhaust.', keywords: ['exhaust'] },
  },
  { materialId: 'void_cosmos_tear', name: 'Cosmos Tear', oreType: OreType.Void, rarity: Rarity.Epic,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 12, target: 'all_enemies' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Deal 12 damage to ALL. Apply 2 Vulnerable to ALL.' },
    skill: { cost: 2, effects: [{ type: 'draw', value: 3, target: 'self' }, { type: 'gain_energy', value: 1, target: 'self' }], desc: 'Draw 3 cards. Gain 1 Energy. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 2, target: 'self', statusId: 'strength' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Gain 2 Strength. Apply 2 Vulnerable to ALL.' },
  },
  // --- Legendary ---
  { materialId: 'void_null_crystal', name: 'Null Crystal', oreType: OreType.Void, rarity: Rarity.Legendary,
    attack: { cost: 3, effects: [{ type: 'aoe_damage', value: 20, target: 'all_enemies' }, { type: 'apply_status', value: 3, target: 'all_enemies', statusId: 'weakness' }, { type: 'apply_status', value: 3, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Deal 20 damage to ALL. Apply 3 Weakness and 3 Vulnerable to ALL. Exhaust.', keywords: ['exhaust'] },
    skill: { cost: 3, effects: [{ type: 'block', value: 25, target: 'self' }, { type: 'apply_status', value: 5, target: 'all_enemies', statusId: 'poison' }], desc: 'Gain 25 Block. Apply 5 Poison to ALL. Exhaust.', keywords: ['exhaust'] },
    power: { cost: 3, effects: [{ type: 'apply_status', value: 3, target: 'all_enemies', statusId: 'poison' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'weakness' }, { type: 'apply_status', value: 2, target: 'all_enemies', statusId: 'vulnerable' }], desc: 'Apply 3 Poison, 2 Weakness, 2 Vulnerable to ALL each turn. Exhaust.', keywords: ['exhaust'] },
  },
];

// ============================================================
// ASSEMBLE ALL CARDS
// ============================================================

const FIRE_CARDS = FIRE_DEFS.flatMap(createVariants);
const WATER_CARDS = WATER_DEFS.flatMap(createVariants);
const EARTH_CARDS = EARTH_DEFS.flatMap(createVariants);
const VOID_CARDS = VOID_DEFS.flatMap(createVariants);

export const ALL_CARDS: Card[] = [
  ...STARTER_CARDS,
  ...COLORLESS_CARDS,
  ...FIRE_CARDS,
  ...WATER_CARDS,
  ...EARTH_CARDS,
  ...VOID_CARDS,
];

export const CARD_BY_ID = new Map(ALL_CARDS.map((c) => [c.id, c]));

export function getCardsByOre(ore: OreType): Card[] {
  return ALL_CARDS.filter((c) => c.oreType === ore);
}

export function getCardsByOreAndRarity(ore: OreType, rarity: Rarity): Card[] {
  return ALL_CARDS.filter((c) => c.oreType === ore && c.rarity === rarity);
}

export function getCardsByType(type: Card['type']): Card[] {
  return ALL_CARDS.filter((c) => c.type === type);
}

export function getStarterDeck(oreAffinity: OreType): Card[] {
  const strikes = Array.from({ length: 4 }, () => ({ ...CARD_BY_ID.get('strike')! }));
  const defends = Array.from({ length: 3 }, () => ({ ...CARD_BY_ID.get('defend')! }));

  const oreCommons = ALL_CARDS.filter(
    (c) => c.oreType === oreAffinity && c.rarity === Rarity.Common,
  );
  const oreAttacks = oreCommons.filter((c) => c.type === 'attack');
  const oreSkills = oreCommons.filter((c) => c.type === 'skill');

  const sig1 = oreAttacks[0] ? { ...oreAttacks[0] } : { ...strikes[0] };
  const sig2 = oreAttacks[1] ? { ...oreAttacks[1] } : { ...strikes[0] };
  const sig3 = oreSkills[0] ? { ...oreSkills[0] } : { ...defends[0] };

  return [...strikes, ...defends, sig1, sig2, sig3];
}
