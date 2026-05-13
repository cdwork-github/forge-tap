# ⚒️ Forge Tap

A roguelike deckbuilder Telegram Mini Game where you tap ore to forge materials, craft relics, and battle through dungeons with card combat — inspired by Slay the Spire.

🎮 **Live Demo (under construction):** [forge-tap.vercel.app](https://forge-tap.vercel.app)

---

## ✨ Features

### Hub Mode (Tap & Forge)
- Tap ore veins across **4 elements** (Fire 🔥, Water 💧, Earth 🌿, Void 🌀)
- Forge **44 unique materials** with weighted rarity rolls (Common → Legendary)
- Craft **22 relics** that grant passive bonuses in combat
- Energy regenerates passively over time

### Dungeon Mode (Roguelike Deckbuilder)
- **142 cards** across 4 elements × 3 variants (Attack / Skill / Power)
- **36 enemies** with cycle, random, and conditional AI patterns
- **10-floor branching maps** with combat, elite, forge, rest, shop, and event nodes
- **9 status effects**: Burn, Poison, Strength, Weakness, Vulnerable, Armor, Thorns, Freeze, Regen
- **Card upgrades** at rest sites (+25% damage/block, -1 cost on powers)
- Sequential dungeon unlock: beat Fire → Water → Earth → Void

### Polish
- 5-screen tutorial with progressive hub hints
- Run summary screen with stats breakdown
- Mobile-first 390×844 layout (works in Telegram WebView)
- Tap-to-select + tap-to-target combat (no fiddly drag)

---

## 🚀 Stack

- **[Phaser 3.90](https://phaser.io)** — Game engine (no physics loaded)
- **[Vite 6](https://vitejs.dev)** — Build tool with HMR
- **TypeScript 5** — Strict mode, full type safety
- **No external assets** — All graphics generated at runtime via Phaser Graphics API

---

## 🏃 Run Locally

```bash
git clone https://github.com/cdwork-github/forge-tap.git
cd forge-tap
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Other commands

```bash
npm run build      # Typecheck + production build
npm run preview    # Serve production build
npm run typecheck  # tsc --noEmit
```

---

## 🏗️ Architecture

```
src/
├── scenes/         11 Phaser scenes (Boot → Preload → MainGame ↔ Dungeon flow)
├── state/          Singleton stores: GameStore, RunStore, CombatStore
├── data/           142 cards, 36 enemies, 22 recipes, 10 events, 4 dungeons
├── models/         TypeScript interfaces for all game entities
├── ui/             Reusable Phaser components (Button, ProgressBar, Card, etc.)
└── utils/          Color palette, weighted random, card upgrade logic
```

### Scene Flow

```
Boot → Preload → Tutorial (first launch only) → MainGame (Hub)
                                                   ├── Forge (overlay)
                                                   ├── Inventory
                                                   └── DungeonSelect → Map
                                                                        ├── Combat → Reward
                                                                        ├── Event
                                                                        ├── Shop
                                                                        ├── Rest
                                                                        └── Boss → RunSummary
```

---

## 🎯 Roadmap

- [ ] Telegram WebApp SDK integration (auto-login)
- [ ] Supabase backend for cross-device save sync
- [ ] Leaderboards (fastest run, highest ascension)
- [ ] Real art assets (currently placeholder graphics)
- [ ] Sound and music
- [ ] TON wallet integration (NFT relics, FORGE token)
- [ ] Telegram Stars monetization (energy refills, dungeon keys)
- [ ] Rewarded video ads (Telegram Ads SDK)

---

## 📄 License

MIT
