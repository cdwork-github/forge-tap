# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Forge Tap is a **roguelike deckbuilder** Telegram Mini Game (currently browser-only). Two modes:
- **Tap Mode** (hub): Tap ore veins → forge materials → craft relics. Daily engagement loop.
- **Dungeon Mode**: StS-style card combat across 10-floor dungeon runs. Materials earned persist.

## Stack

- **Game engine**: Phaser 3.90 (no physics loaded)
- **Build**: Vite 6.x with TypeScript 5.x
- **Resolution**: 390x844 (mobile-first, FIT scaling)
- **Assets**: All runtime-generated via Phaser Graphics API (no image files)
- **State**: Singleton stores (GameStore, RunStore, CombatStore) with event emitters + localStorage

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # Typecheck + production build
npm run preview    # Serve production build
npm run typecheck  # tsc --noEmit
```

## Architecture

### Scenes (11 total)

```
Boot → Preload → MainGame (hub)
                   ├── Forge (tap overlay)
                   ├── Inventory (materials/items/recipes)
                   └── DungeonSelect → Map → Combat → Reward → Map → ...
                                         ├── Event
                                         └── Shop
```

### State Managers

- `GameStore` — Permanent state: materials, items, relics, ascension, run stats. Persists to localStorage.
- `RunStore` — Run-specific: deck, HP, gold, map, floor. Created per run, discarded on end.
- `CombatStore` — Combat-specific: hand, draw/discard/exhaust piles, enemies, energy, status effects.

### Data Layer

- `data/cards.ts` — 142 cards (2 starter + 8 colorless + 132 element: 3 variants per 44 materials)
- `data/enemies.ts` — 36 enemies (5 basic + 2 elite + 1 boss × 4 acts) with state machine AI
- `data/events.ts` — 10 events with preconditions and multi-choice decision trees
- `data/dungeons.ts` — 4 dungeon configs with 10-floor branching map templates
- `data/materials.ts` — 44 materials, `data/recipes.ts` — 14 recipes/items (relics)
- `data/rarityConfig.ts`, `data/oreConfig.ts` — Visual/weight configs

### UI Components

- `Button`, `ProgressBar`, `TapFeedback`, `MaterialCard` — Hub UI
- `MapNodeDisplay` + `drawConnections` — Branching map rendering

## Key Patterns

- **Card combat**: Tap card to select (floats up), tap enemy to target. AoE auto-targets all.
- **Enemy AI**: Three pattern types — `cycle` (fixed rotation), `random` (weighted), `conditional` (HP/turn-based).
- **Ore tap in combat**: +1 energy, -3 HP. Risk/reward decision that connects the forge identity to combat.
- **Status effects**: Counter type (decreases per turn: Burn, Weakness, Vulnerable, Armor, Freeze, Regen) vs Permanent (Strength, Thorns, Poison).
- **Meta-progression**: Materials earned in runs → permanent collection → craft relics → equip in future runs. Ascension levels per dungeon.
- **Scene transitions**: Hub uses sleep/wake. Dungeon scenes use stop/launch (each node is a fresh scene).
- **Phaser 3.60+ particles**: `this.add.particles(x, y, key, config)` — old createEmitter is gone.
- **Path aliases**: `@/` maps to `src/` via tsconfig paths + Vite alias.

## Game Balance

- Starter deck: 4 Strike (1E: 6 dmg) + 3 Defend (1E: 5 block) + 3 element cards = 10 cards
- Base energy: 3/turn. Ore tap: +1E / -3HP.
- Rarity weights: Common=50, Uncommon=25, Rare=15, Epic=8, Legendary=2
- Gold: 15-20 per combat, 30-40 elite, 50 boss. Cards cost 45-110g, relics 100-250g, removal 50g.
- Runs: 10 floors, ~8-12 minutes. Branching map with 2-3 nodes per floor row.

## Not Yet Implemented

- Telegram Web Apps API integration
- TON blockchain / wallet connection
- Backend / API
- Sound / music
- Real art assets (all placeholder graphics)
- Referral system / leaderboards
- Card upgrade system at rest sites
- Ascension modifiers (data defined, not yet applied in combat)
