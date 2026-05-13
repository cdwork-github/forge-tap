import Phaser from 'phaser';
import { OreType } from '@/models/types';
import { ORE_CONFIG } from '@/data/oreConfig';
import { DUNGEONS } from '@/data/dungeons';
import { ACTS } from '@/data/enemies';
import { RunStore } from '@/state/RunStore';
import { GameStore } from '@/state/GameStore';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';

export class DungeonSelectScene extends Phaser.Scene {
  private selectedDungeon = 0;
  private selectedOre: OreType = OreType.Fire;
  private dungeonButtons: Button[] = [];
  private oreButtons: Button[] = [];
  private affinityLabel?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'DungeonSelect' });
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    // Title
    this.add.text(195, 40, 'SELECT DUNGEON', {
      fontSize: '22px',
      color: hexToString(COLORS.text),
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Back button
    new Button(this, 50, 40, 70, 32, 'BACK', COLORS.surfaceLight)
      .onClick(() => {
        this.scene.stop('DungeonSelect');
        this.scene.wake('MainGame');
      });

    // Dungeon buttons
    this.add.text(195, 90, 'DUNGEON', {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);

    const gameStore = GameStore.getInstance();
    this.dungeonButtons = [];

    DUNGEONS.forEach((dungeon, i) => {
      const act = ACTS.find((a) => a.id === dungeon.actId);
      const unlocked = gameStore.isDungeonUnlocked(dungeon.actId);
      const color = unlocked ? (act?.color ?? COLORS.surfaceLight) : 0x333333;
      const y = 130 + i * 60;

      const btn = new Button(this, 195, y, 300, 48, unlocked ? dungeon.name : `🔒 ${dungeon.name}`, color);
      this.dungeonButtons.push(btn);

      if (unlocked) {
        btn.onClick(() => {
          this.selectedDungeon = i;
          this.updateSelection();
        });
      } else {
        const prevName = DUNGEONS[i - 1]?.name ?? '';
        this.add.text(195, y + 28, `Beat ${prevName} to unlock`, {
          fontSize: '9px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
        }).setOrigin(0.5);
      }
    });

    // Ore affinity selection
    this.add.text(195, 390, 'ORE AFFINITY', {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.oreButtons = [];
    const ores = Object.values(OreType);
    ores.forEach((ore, i) => {
      const config = ORE_CONFIG[ore];
      const x = 55 + i * 93;
      const btn = new Button(this, x, 430, 75, 55, config.emoji, config.color);
      btn.onClick(() => {
        this.selectedOre = ore;
        this.updateSelection();
      });
      this.oreButtons.push(btn);
    });

    // Affinity label
    this.affinityLabel = this.add.text(195, 475, '', {
      fontSize: '12px', color: hexToString(COLORS.text), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Info display
    this.add.text(195, 500, 'Starter: 4 Strike + 3 Defend + 3 Element', {
      fontSize: '11px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(195, 520, '10 Floors | 3 Energy | 70 HP', {
      fontSize: '11px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Start button
    new Button(this, 195, 600, 260, 56, 'START RUN', COLORS.accent)
      .onClick(() => {
        const dungeon = DUNGEONS[this.selectedDungeon];
        const runStore = RunStore.getInstance();
        runStore.startRun(dungeon.id, this.selectedOre);
        this.scene.stop('DungeonSelect');
        this.scene.launch('Map');
      });

    this.updateSelection();
  }

  private updateSelection(): void {
    // Highlight selected dungeon
    this.dungeonButtons.forEach((btn, i) => {
      btn.setHighlight(i === this.selectedDungeon);
    });

    // Highlight selected ore
    const ores = Object.values(OreType);
    this.oreButtons.forEach((btn, i) => {
      btn.setHighlight(ores[i] === this.selectedOre);
    });

    // Update affinity label
    const oreConfig = ORE_CONFIG[this.selectedOre];
    if (this.affinityLabel) {
      this.affinityLabel.setText(`${oreConfig.emoji} ${oreConfig.name} Affinity`);
    }
  }
}
