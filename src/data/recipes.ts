import { Item, Recipe } from '@/models/Item';
import { Rarity } from '@/models/types';

export const RECIPES: Recipe[] = [
  // Cross-element recipes (more valuable)
  { id: 'steam_blade', materialIds: ['fire_flame_crystal', 'water_frost_gem'], resultItemId: 'steam_blade' },
  { id: 'obsidian_edge', materialIds: ['fire_molten_shard', 'earth_iron_chunk'], resultItemId: 'obsidian_edge' },
  { id: 'shadow_flame', materialIds: ['fire_ember_dust', 'void_shadow_wisp'], resultItemId: 'shadow_flame' },
  { id: 'coral_crown', materialIds: ['water_coral_bit', 'earth_jade_shard'], resultItemId: 'coral_crown' },
  { id: 'void_tide', materialIds: ['water_tide_stone', 'void_dark_essence'], resultItemId: 'void_tide' },
  { id: 'nether_root', materialIds: ['earth_root_fiber', 'void_echo_shard'], resultItemId: 'nether_root' },
  // High-tier recipes
  { id: 'solar_trident', materialIds: ['fire_solar_core', 'water_ocean_tear'], resultItemId: 'solar_trident' },
  { id: 'world_ender', materialIds: ['earth_tectonic_heart', 'void_oblivion_shard'], resultItemId: 'world_ender' },
  { id: 'eternal_flame', materialIds: ['fire_phoenix_core', 'void_null_crystal'], resultItemId: 'eternal_flame' },
  { id: 'genesis_pearl', materialIds: ['water_abyssal_pearl', 'earth_worldstone'], resultItemId: 'genesis_pearl' },
  // Same-element recipes
  { id: 'magma_ring', materialIds: ['fire_magma_chunk', 'fire_cinder_shard'], resultItemId: 'magma_ring' },
  { id: 'glacial_shield', materialIds: ['water_glacier_heart', 'water_deep_pearl'], resultItemId: 'glacial_shield' },
  { id: 'titan_gauntlet', materialIds: ['earth_titan_bone', 'earth_crystal_vein'], resultItemId: 'titan_gauntlet' },
  { id: 'rift_cloak', materialIds: ['void_nightmare_gem', 'void_rift_stone'], resultItemId: 'rift_cloak' },
  // New recipes — covers all 16 previously orphaned materials
  { id: 'ash_storm', materialIds: ['fire_ash_flake', 'water_sea_salt'], resultItemId: 'ash_storm' },
  { id: 'blaze_tide', materialIds: ['fire_blaze_ore', 'water_wave_crystal'], resultItemId: 'blaze_tide' },
  { id: 'inferno_shield', materialIds: ['fire_inferno_gem', 'earth_clay_fragment'], resultItemId: 'inferno_shield' },
  { id: 'dragon_scale', materialIds: ['fire_dragon_heart', 'water_leviathan_scale'], resultItemId: 'dragon_scale' },
  { id: 'amber_root', materialIds: ['earth_amber_piece', 'earth_moss_stone'], resultItemId: 'amber_root' },
  { id: 'diamond_edge', materialIds: ['earth_diamond_seed', 'void_dark_mote'], resultItemId: 'diamond_edge' },
  { id: 'phase_blade', materialIds: ['void_phase_crystal', 'void_entropy_dust'], resultItemId: 'phase_blade' },
  { id: 'cosmos_dew', materialIds: ['void_cosmos_tear', 'water_dew_drop'], resultItemId: 'cosmos_dew' },
];

export const ITEMS: Item[] = [
  // Cross-element items
  { id: 'steam_blade', name: 'Steam Blade', rarity: Rarity.Uncommon, description: 'A blade forged from fire and ice', color: 0xff6347, recipe: RECIPES[0] },
  { id: 'obsidian_edge', name: 'Obsidian Edge', rarity: Rarity.Rare, description: 'Razor-sharp edge of volcanic glass', color: 0x2f2f2f, recipe: RECIPES[1] },
  { id: 'shadow_flame', name: 'Shadow Flame', rarity: Rarity.Common, description: 'A dark fire that casts no light', color: 0x8b008b, recipe: RECIPES[2] },
  { id: 'coral_crown', name: 'Coral Crown', rarity: Rarity.Uncommon, description: 'Crown woven from living coral and jade', color: 0x20b2aa, recipe: RECIPES[3] },
  { id: 'void_tide', name: 'Void Tide', rarity: Rarity.Uncommon, description: 'Water that flows into nothingness', color: 0x000080, recipe: RECIPES[4] },
  { id: 'nether_root', name: 'Nether Root', rarity: Rarity.Common, description: 'Root that grows between dimensions', color: 0x556b2f, recipe: RECIPES[5] },
  // High-tier items
  { id: 'solar_trident', name: 'Solar Trident', rarity: Rarity.Epic, description: 'Trident that commands sun and sea', color: 0xffa500, recipe: RECIPES[6] },
  { id: 'world_ender', name: 'World Ender', rarity: Rarity.Epic, description: 'Weapon that unmakes reality', color: 0x4a0e4e, recipe: RECIPES[7] },
  { id: 'eternal_flame', name: 'Eternal Flame', rarity: Rarity.Legendary, description: 'A flame that burns beyond existence', color: 0xffd700, recipe: RECIPES[8] },
  { id: 'genesis_pearl', name: 'Genesis Pearl', rarity: Rarity.Legendary, description: 'Pearl containing the seed of a new world', color: 0x00ff7f, recipe: RECIPES[9] },
  // Same-element items
  { id: 'magma_ring', name: 'Magma Ring', rarity: Rarity.Uncommon, description: 'Ring of solidified magma', color: 0xb22222, recipe: RECIPES[10] },
  { id: 'glacial_shield', name: 'Glacial Shield', rarity: Rarity.Rare, description: 'Shield of unbreakable ice', color: 0x00ced1, recipe: RECIPES[11] },
  { id: 'titan_gauntlet', name: 'Titan Gauntlet', rarity: Rarity.Rare, description: 'Gauntlet forged from titan remains', color: 0xdaa520, recipe: RECIPES[12] },
  { id: 'rift_cloak', name: 'Rift Cloak', rarity: Rarity.Rare, description: 'Cloak woven from dimensional tears', color: 0x9932cc, recipe: RECIPES[13] },
  // New items from new recipes
  { id: 'ash_storm', name: 'Ash Storm', rarity: Rarity.Common, description: 'A storm of cinders and salt', color: 0x8b6914, recipe: RECIPES[14] },
  { id: 'blaze_tide', name: 'Blaze Tide', rarity: Rarity.Uncommon, description: 'Waves of fire that never cool', color: 0xff4500, recipe: RECIPES[15] },
  { id: 'inferno_shield', name: 'Inferno Shield', rarity: Rarity.Rare, description: 'Shield forged in volcanic clay', color: 0xcc3300, recipe: RECIPES[16] },
  { id: 'dragon_scale', name: 'Dragon Scale', rarity: Rarity.Epic, description: 'Scale harder than any armor', color: 0x191970, recipe: RECIPES[17] },
  { id: 'amber_root', name: 'Amber Root', rarity: Rarity.Uncommon, description: 'Living root encased in amber', color: 0xdaa520, recipe: RECIPES[18] },
  { id: 'diamond_edge', name: 'Diamond Edge', rarity: Rarity.Epic, description: 'Edge that cuts through void itself', color: 0xb9f2ff, recipe: RECIPES[19] },
  { id: 'phase_blade', name: 'Phase Blade', rarity: Rarity.Uncommon, description: 'Blade that shifts between dimensions', color: 0xba55d3, recipe: RECIPES[20] },
  { id: 'cosmos_dew', name: 'Cosmos Dew', rarity: Rarity.Epic, description: 'Dew distilled from the cosmos', color: 0x7b68ee, recipe: RECIPES[21] },
];

export const ITEM_BY_ID = new Map(ITEMS.map((item) => [item.id, item]));
