import Phaser from 'phaser';
import { BootScene } from '@/scenes/BootScene';
import { PreloadScene } from '@/scenes/PreloadScene';
import { MainGameScene } from '@/scenes/MainGameScene';
import { ForgeScene } from '@/scenes/ForgeScene';
import { InventoryScene } from '@/scenes/InventoryScene';
import { DungeonSelectScene } from '@/scenes/DungeonSelectScene';
import { MapScene } from '@/scenes/MapScene';
import { CombatScene } from '@/scenes/CombatScene';
import { RewardScene } from '@/scenes/RewardScene';
import { EventScene } from '@/scenes/EventScene';
import { ShopScene } from '@/scenes/ShopScene';
import { RestScene } from '@/scenes/RestScene';
import { TutorialScene } from '@/scenes/TutorialScene';
import { RunSummaryScene } from '@/scenes/RunSummaryScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 390,
  height: 844,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene, PreloadScene, MainGameScene, ForgeScene, InventoryScene,
    DungeonSelectScene, MapScene, CombatScene, RewardScene, EventScene, ShopScene, RestScene, TutorialScene, RunSummaryScene,
  ],
};

new Phaser.Game(config);
