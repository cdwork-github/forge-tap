import { Material } from '@/models/Material';
import { OreType, Rarity } from '@/models/types';

export const MATERIALS: Material[] = [
  // === FIRE ===
  // Common
  { id: 'fire_ember_dust', name: 'Ember Dust', oreType: OreType.Fire, rarity: Rarity.Common, description: 'Fine particles of cooling flame', color: 0xff6b35 },
  { id: 'fire_ash_flake', name: 'Ash Flake', oreType: OreType.Fire, rarity: Rarity.Common, description: 'Fragile remnants of intense heat', color: 0x8b4513 },
  { id: 'fire_cinder_shard', name: 'Cinder Shard', oreType: OreType.Fire, rarity: Rarity.Common, description: 'Glowing fragment of burnt ore', color: 0xcd5c5c },
  // Uncommon
  { id: 'fire_flame_crystal', name: 'Flame Crystal', oreType: OreType.Fire, rarity: Rarity.Uncommon, description: 'Crystallized fire essence', color: 0xff4500 },
  { id: 'fire_magma_chunk', name: 'Magma Chunk', oreType: OreType.Fire, rarity: Rarity.Uncommon, description: 'Solidified molten rock still warm', color: 0xb22222 },
  { id: 'fire_blaze_ore', name: 'Blaze Ore', oreType: OreType.Fire, rarity: Rarity.Uncommon, description: 'Raw ore infused with flame', color: 0xdc143c },
  // Rare
  { id: 'fire_molten_shard', name: 'Molten Shard', oreType: OreType.Fire, rarity: Rarity.Rare, description: 'Liquid fire frozen in crystal', color: 0xff0000 },
  { id: 'fire_inferno_gem', name: 'Inferno Gem', oreType: OreType.Fire, rarity: Rarity.Rare, description: 'A gem that burns eternally', color: 0xe00000 },
  // Epic
  { id: 'fire_solar_core', name: 'Solar Core', oreType: OreType.Fire, rarity: Rarity.Epic, description: 'Fragment of a captured sun', color: 0xff8c00 },
  { id: 'fire_dragon_heart', name: 'Dragon Heart', oreType: OreType.Fire, rarity: Rarity.Epic, description: 'The molten heart of an ancient dragon', color: 0xcc0000 },
  // Legendary
  { id: 'fire_phoenix_core', name: 'Phoenix Core', oreType: OreType.Fire, rarity: Rarity.Legendary, description: 'Essence of rebirth and eternal flame', color: 0xffd700 },

  // === WATER ===
  // Common
  { id: 'water_dew_drop', name: 'Dew Drop', oreType: OreType.Water, rarity: Rarity.Common, description: 'A perfectly formed drop of pure water', color: 0x87ceeb },
  { id: 'water_sea_salt', name: 'Sea Salt', oreType: OreType.Water, rarity: Rarity.Common, description: 'Crystallized ocean minerals', color: 0xb0c4de },
  { id: 'water_coral_bit', name: 'Coral Bit', oreType: OreType.Water, rarity: Rarity.Common, description: 'Fragment of living reef', color: 0xff7f50 },
  // Uncommon
  { id: 'water_frost_gem', name: 'Frost Gem', oreType: OreType.Water, rarity: Rarity.Uncommon, description: 'Ice that never melts', color: 0x00bfff },
  { id: 'water_tide_stone', name: 'Tide Stone', oreType: OreType.Water, rarity: Rarity.Uncommon, description: 'Stone shaped by a thousand currents', color: 0x4169e1 },
  { id: 'water_wave_crystal', name: 'Wave Crystal', oreType: OreType.Water, rarity: Rarity.Uncommon, description: 'Crystal resonating with ocean rhythm', color: 0x1e90ff },
  // Rare
  { id: 'water_deep_pearl', name: 'Deep Pearl', oreType: OreType.Water, rarity: Rarity.Rare, description: 'Pearl from the deepest trench', color: 0xe0e0e0 },
  { id: 'water_glacier_heart', name: 'Glacier Heart', oreType: OreType.Water, rarity: Rarity.Rare, description: 'Core of an ancient glacier', color: 0x00ced1 },
  // Epic
  { id: 'water_ocean_tear', name: 'Ocean Tear', oreType: OreType.Water, rarity: Rarity.Epic, description: 'A tear shed by the sea itself', color: 0x0000cd },
  { id: 'water_leviathan_scale', name: 'Leviathan Scale', oreType: OreType.Water, rarity: Rarity.Epic, description: 'Scale from a mythical sea creature', color: 0x191970 },
  // Legendary
  { id: 'water_abyssal_pearl', name: 'Abyssal Pearl', oreType: OreType.Water, rarity: Rarity.Legendary, description: 'Pearl of infinite depth and wisdom', color: 0x4169e1 },

  // === EARTH ===
  // Common
  { id: 'earth_clay_fragment', name: 'Clay Fragment', oreType: OreType.Earth, rarity: Rarity.Common, description: 'Raw clay waiting to be shaped', color: 0xa0522d },
  { id: 'earth_moss_stone', name: 'Moss Stone', oreType: OreType.Earth, rarity: Rarity.Common, description: 'Ancient stone covered in living moss', color: 0x6b8e23 },
  { id: 'earth_root_fiber', name: 'Root Fiber', oreType: OreType.Earth, rarity: Rarity.Common, description: 'Sturdy fiber from deep roots', color: 0x8b7355 },
  // Uncommon
  { id: 'earth_iron_chunk', name: 'Iron Chunk', oreType: OreType.Earth, rarity: Rarity.Uncommon, description: 'Dense iron ore with high purity', color: 0x708090 },
  { id: 'earth_jade_shard', name: 'Jade Shard', oreType: OreType.Earth, rarity: Rarity.Uncommon, description: 'Fragment of precious jade', color: 0x00a86b },
  { id: 'earth_amber_piece', name: 'Amber Piece', oreType: OreType.Earth, rarity: Rarity.Uncommon, description: 'Ancient tree resin hardened over ages', color: 0xffbf00 },
  // Rare
  { id: 'earth_crystal_vein', name: 'Crystal Vein', oreType: OreType.Earth, rarity: Rarity.Rare, description: 'A streak of pure crystal in stone', color: 0x98fb98 },
  { id: 'earth_titan_bone', name: 'Titan Bone', oreType: OreType.Earth, rarity: Rarity.Rare, description: 'Fossilized bone of an earth titan', color: 0xdeb887 },
  // Epic
  { id: 'earth_diamond_seed', name: 'Diamond Seed', oreType: OreType.Earth, rarity: Rarity.Epic, description: 'A seed that grows into diamond', color: 0xb9f2ff },
  { id: 'earth_tectonic_heart', name: 'Tectonic Heart', oreType: OreType.Earth, rarity: Rarity.Epic, description: 'Pulse of the living earth', color: 0x556b2f },
  // Legendary
  { id: 'earth_worldstone', name: 'Worldstone', oreType: OreType.Earth, rarity: Rarity.Legendary, description: 'Fragment of the world foundation', color: 0x228b22 },

  // === VOID ===
  // Common
  { id: 'void_shadow_wisp', name: 'Shadow Wisp', oreType: OreType.Void, rarity: Rarity.Common, description: 'Captured shadow with a faint glow', color: 0x9370db },
  { id: 'void_dark_mote', name: 'Dark Mote', oreType: OreType.Void, rarity: Rarity.Common, description: 'Tiny particle of pure darkness', color: 0x483d8b },
  { id: 'void_echo_shard', name: 'Echo Shard', oreType: OreType.Void, rarity: Rarity.Common, description: 'Crystallized sound from the void', color: 0x7b68ee },
  // Uncommon
  { id: 'void_dark_essence', name: 'Dark Essence', oreType: OreType.Void, rarity: Rarity.Uncommon, description: 'Concentrated void energy', color: 0x800080 },
  { id: 'void_phase_crystal', name: 'Phase Crystal', oreType: OreType.Void, rarity: Rarity.Uncommon, description: 'Crystal that shifts between dimensions', color: 0xba55d3 },
  { id: 'void_entropy_dust', name: 'Entropy Dust', oreType: OreType.Void, rarity: Rarity.Uncommon, description: 'Dust of unraveling reality', color: 0x663399 },
  // Rare
  { id: 'void_nightmare_gem', name: 'Nightmare Gem', oreType: OreType.Void, rarity: Rarity.Rare, description: 'A gem that feeds on dreams', color: 0x4b0082 },
  { id: 'void_rift_stone', name: 'Rift Stone', oreType: OreType.Void, rarity: Rarity.Rare, description: 'Stone torn from a dimensional rift', color: 0x8a2be2 },
  // Epic
  { id: 'void_oblivion_shard', name: 'Oblivion Shard', oreType: OreType.Void, rarity: Rarity.Epic, description: 'Fragment of true nothingness', color: 0x2e003e },
  { id: 'void_cosmos_tear', name: 'Cosmos Tear', oreType: OreType.Void, rarity: Rarity.Epic, description: 'Tear in the fabric of reality', color: 0x9400d3 },
  // Legendary
  { id: 'void_null_crystal', name: 'Null Crystal', oreType: OreType.Void, rarity: Rarity.Legendary, description: 'Crystal of absolute emptiness and infinite potential', color: 0xda70d6 },
];

// Lookup helpers
export const MATERIAL_BY_ID = new Map(MATERIALS.map((m) => [m.id, m]));

export function getMaterialsByOreAndRarity(ore: OreType, rarity: Rarity): Material[] {
  return MATERIALS.filter((m) => m.oreType === ore && m.rarity === rarity);
}
