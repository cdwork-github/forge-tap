import Phaser from 'phaser';
import { OreType } from '@/models/types';
import { ORE_CONFIG } from '@/data/oreConfig';
import { GameStore } from '@/state/GameStore';
import { ProgressBar } from '@/ui/ProgressBar';
import { TapFeedback } from '@/ui/TapFeedback';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';

const REGEN_PER_SECOND = 2;

export class MainGameScene extends Phaser.Scene {
  private store!: GameStore;
  private energyBar!: ProgressBar;
  private forgeBar!: ProgressBar;
  private oreVein!: Phaser.GameObjects.Image;
  private oreButtons: Button[] = [];
  private materialCountText!: Phaser.GameObjects.Text;
  private tapsText!: Phaser.GameObjects.Text;
  private depletedOverlay?: Phaser.GameObjects.Container;
  private regenTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'MainGame' });
  }

  create(): void {
    this.store = GameStore.getInstance();

    this.createTopBar();
    this.createOreSelector();
    this.createTapZone();
    this.createForgeProgress();
    this.createBottomBar();
    this.showHints();
    this.startEnergyRegen();

    // Listen for forge event
    this.store.on('forge', this.onForge);
    this.events.on('shutdown', () => this.store.off('forge', this.onForge));

    // Handle scene wake (returning from Forge/Inventory)
    this.events.on('wake', () => {
      this.refreshDisplays();
      this.startEnergyRegen();
      if (this.dungeonHint && this.store.isHintShown('crafted')) {
        this.dungeonHint.destroy();
        this.dungeonHint = undefined;
      }
    });
    this.events.on('resume', () => {
      this.refreshDisplays();
    });
  }

  private createTopBar(): void {
    // Material count
    const matIcon = this.add.rectangle(25, 30, 16, 16, COLORS.accent);
    void matIcon;
    this.materialCountText = this.add.text(42, 30, '0', {
      fontSize: '16px',
      color: hexToString(COLORS.text),
      fontFamily: 'monospace',
    }).setOrigin(0, 0.5);

    // Energy bar
    this.energyBar = new ProgressBar(this, 160, 22, 200, 16, COLORS.energy, 0x333333, true);
    this.add.text(160, 44, 'ENERGY', {
      fontSize: '10px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
    });

    this.refreshEnergyDisplay();
    this.refreshMaterialCount();
  }

  private createOreSelector(): void {
    const ores = Object.values(OreType);
    const startX = 55;
    const spacing = 93;
    const y = 120;

    this.add.text(195, 78, 'SELECT ORE VEIN', {
      fontSize: '12px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    ores.forEach((ore, i) => {
      const config = ORE_CONFIG[ore];
      const btn = new Button(this, startX + i * spacing, y, 75, 60, config.emoji, config.color);
      btn.onClick(() => {
        this.store.setOreType(ore);
        this.updateOreSelection();
      });
      this.oreButtons.push(btn);
    });

    this.updateOreSelection();
  }

  private updateOreSelection(): void {
    const currentOre = this.store.getState().currentOreType;
    const ores = Object.values(OreType);

    this.oreButtons.forEach((btn, i) => {
      btn.setHighlight(ores[i] === currentOre);
    });

    // Update ore vein texture
    if (this.oreVein) {
      this.oreVein.setTexture(`ore-${currentOre}`);
    }
  }

  private createTapZone(): void {
    const currentOre = this.store.getState().currentOreType;

    // Tap zone background glow
    const glow = this.add.circle(195, 430, 120, COLORS.surfaceLight, 0.3);
    void glow;

    // Ore vein sprite
    this.oreVein = this.add.image(195, 430, `ore-${currentOre}`);
    this.oreVein.setScale(2);
    this.oreVein.setInteractive({ useHandCursor: true });

    this.oreVein.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
      if (this.store.getState().energy <= 0) return;

      const tapped = this.store.tap();
      if (!tapped) return;

      // Check if energy depleted after this tap
      if (this.store.getState().energy <= 0) {
        this.showDepletedOverlay();
      }

      // Visual feedback
      TapFeedback.play(this, 195, 400, this.store.getState().currentOreType);

      // Ore vein bounce
      this.tweens.add({
        targets: this.oreVein,
        scaleX: 2.1,
        scaleY: 2.1,
        duration: 50,
        yoyo: true,
        ease: 'Power1',
      });

      this.refreshForgeProgress();
      this.refreshEnergyDisplay();
      this.refreshTapsDisplay();
    });

    // Tap instruction
    this.add.text(195, 550, 'TAP TO MINE', {
      fontSize: '14px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }

  private createForgeProgress(): void {
    this.add.text(65, 620, 'FORGE PROGRESS', {
      fontSize: '11px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
    });

    this.forgeBar = new ProgressBar(this, 65, 645, 260, 20, COLORS.gold, 0x333333, true);
    this.refreshForgeProgress();
  }

  private createBottomBar(): void {
    // Inventory button
    new Button(this, 65, 760, 100, 44, 'INVENTORY', COLORS.surfaceLight)
      .onClick(() => {
        this.scene.sleep('MainGame');
        this.scene.launch('Inventory');
      });

    // Dungeon button
    new Button(this, 195, 760, 120, 44, 'DUNGEON', COLORS.accent)
      .onClick(() => {
        this.scene.sleep('MainGame');
        this.scene.launch('DungeonSelect');
      });

    // Taps counter
    this.tapsText = this.add.text(370, 760, '', {
      fontSize: '12px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
      align: 'right',
    }).setOrigin(1, 0.5);

    this.refreshTapsDisplay();
  }

  private startEnergyRegen(): void {
    if (this.regenTimer) this.regenTimer.destroy();
    this.regenTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const state = this.store.getState();
        if (state.energy < state.maxEnergy) {
          this.store.regenEnergy(REGEN_PER_SECOND);
          this.refreshEnergyDisplay();
        }
      },
    });
  }

  private showDepletedOverlay(): void {
    if (this.depletedOverlay) return;

    this.depletedOverlay = this.add.container(0, 0);

    const bg = this.add.rectangle(195, 430, 300, 120, 0x000000, 0.85);
    this.depletedOverlay.add(bg);

    const title = this.add.text(195, 410, 'ENERGY DEPLETED', {
      fontSize: '22px',
      color: hexToString(COLORS.accent),
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.depletedOverlay.add(title);

    const subtitle = this.add.text(195, 445, 'Regenerating...', {
      fontSize: '14px',
      color: hexToString(COLORS.textMuted),
      fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.depletedOverlay.add(subtitle);

    // Check every 500ms if energy has regenerated enough to dismiss
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.store.getState().energy >= 10) {
          this.depletedOverlay?.destroy();
          this.depletedOverlay = undefined;
          this.refreshEnergyDisplay();
        }
      },
    });
  }

  private onForge = (): void => {
    this.scene.pause('MainGame');
    this.scene.launch('Forge', { oreType: this.store.getState().currentOreType });
  };

  private refreshEnergyDisplay(): void {
    const state = this.store.getState();
    this.energyBar.setValue(state.energy, state.maxEnergy);
    this.energyBar.setFillColor(state.energy < 20 ? COLORS.energyLow : COLORS.energy);
  }

  private refreshForgeProgress(): void {
    this.forgeBar.setValue(this.store.getState().currentForgeProgress, 50);
  }

  private refreshMaterialCount(): void {
    this.materialCountText.setText(`${this.store.getTotalMaterialCount()}`);
  }

  private refreshTapsDisplay(): void {
    const state = this.store.getState();
    this.tapsText.setText(`Taps: ${state.sessionTaps}\nTotal: ${state.totalTaps}`);
  }

  private refreshDisplays(): void {
    this.refreshEnergyDisplay();
    this.refreshForgeProgress();
    this.refreshMaterialCount();
    this.refreshTapsDisplay();
  }

  private tapHint?: Phaser.GameObjects.Container;
  private inventoryHint?: Phaser.GameObjects.Container;
  private dungeonHint?: Phaser.GameObjects.Container;

  private showHints(): void {
    // "Tap here!" hint
    if (!this.store.isHintShown('tapped')) {
      this.tapHint = this.createHintArrow(195, 350, 'Tap here!');
      this.store.on('tap', this.dismissTapHint);
    }

    // "Check Inventory!" after first forge
    if (!this.store.isHintShown('forged') && this.store.isHintShown('tapped')) {
      this.inventoryHint = this.createHintArrow(65, 730, 'Check Inventory!');
    }
    this.store.on('forge', this.showInventoryHint);

    // "Try a Dungeon!" after items exist
    if (!this.store.isHintShown('crafted') && this.store.isHintShown('forged')) {
      if (Object.values(this.store.getState().items).some((c) => c > 0)) {
        this.dungeonHint = this.createHintArrow(195, 730, 'Try a Dungeon!');
        this.store.markHintShown('crafted');
      }
    }
    this.store.on('item-crafted', this.showDungeonHint);
  }

  private createHintArrow(x: number, y: number, text: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const arrow = this.add.text(0, -15, '▼', {
      fontSize: '20px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);

    const label = this.add.text(0, -40, text, {
      fontSize: '12px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
      backgroundColor: '#000000', padding: { x: 6, y: 3 },
    }).setOrigin(0.5);

    container.add([arrow, label]);

    this.tweens.add({
      targets: container,
      y: y + 8,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    return container;
  }

  private dismissTapHint = (): void => {
    if (this.tapHint) {
      this.tapHint.destroy();
      this.tapHint = undefined;
      this.store.markHintShown('tapped');
      this.store.off('tap', this.dismissTapHint);
    }
  };

  private showInventoryHint = (): void => {
    if (this.store.isHintShown('forged') || !this.store.isHintShown('tapped')) return;
    this.store.markHintShown('forged');
    this.store.off('forge', this.showInventoryHint);
    if (!this.inventoryHint) {
      this.inventoryHint = this.createHintArrow(65, 730, 'Check Inventory!');
    }
  };

  private showDungeonHint = (): void => {
    if (this.store.isHintShown('crafted')) return;
    this.store.markHintShown('crafted');
    this.store.off('item-crafted', this.showDungeonHint);
    if (this.inventoryHint) {
      this.inventoryHint.destroy();
      this.inventoryHint = undefined;
    }
    this.dungeonHint = this.createHintArrow(195, 730, 'Try a Dungeon!');
  };
}
