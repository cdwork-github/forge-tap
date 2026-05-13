import Phaser from 'phaser';
import { OreType } from '@/models/types';
import { ORE_CONFIG } from '@/data/oreConfig';
import { GameStore } from '@/state/GameStore';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  create(): void {
    const cx = 195;
    const cy = 422;

    // Progress bar
    const barW = 260;
    const barH = 16;
    const barBg = this.add.rectangle(cx, cy, barW, barH, 0x333333).setOrigin(0.5);
    const barFill = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0xe94560).setOrigin(0, 0.5);
    const loadText = this.add.text(cx, cy - 30, 'Forging assets...', {
      fontSize: '14px',
      color: '#9e9e9e',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Generate textures
    this.generateOreTextures();
    this.generateParticleTextures();
    this.generateMiscTextures();

    // Animate progress bar then transition
    this.tweens.add({
      targets: barFill,
      width: barW,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        loadText.setText('Ready!');
        this.time.delayedCall(300, () => {
          const nextScene = GameStore.getInstance().isTutorialComplete() ? 'MainGame' : 'Tutorial';
          this.scene.start(nextScene);
        });
      },
    });

    // Keep barBg reference alive to avoid GC flicker
    void barBg;
  }

  private generateOreTextures(): void {
    for (const ore of Object.values(OreType)) {
      const config = ORE_CONFIG[ore];
      const g = this.make.graphics({ x: 0, y: 0 });

      // Ore vein: circle with gradient-like effect
      g.fillStyle(config.color, 1);
      g.fillCircle(50, 50, 50);
      g.fillStyle(config.secondaryColor, 0.4);
      g.fillCircle(40, 40, 25);
      g.generateTexture(`ore-${ore}`, 100, 100);
      g.destroy();
    }
  }

  private generateParticleTextures(): void {
    for (const ore of Object.values(OreType)) {
      const config = ORE_CONFIG[ore];
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(config.color, 1);
      g.fillRect(0, 0, 6, 6);
      g.generateTexture(`particle-${ore}`, 6, 6);
      g.destroy();
    }

    // Gold particle for legendary reveals
    const gold = this.make.graphics({ x: 0, y: 0 });
    gold.fillStyle(0xffd700, 1);
    gold.fillRect(0, 0, 6, 6);
    gold.generateTexture('particle-gold', 6, 6);
    gold.destroy();
  }

  private generateMiscTextures(): void {
    // Anvil placeholder
    const anvil = this.make.graphics({ x: 0, y: 0 });
    anvil.fillStyle(0x555555, 1);
    anvil.fillRoundedRect(0, 0, 120, 70, 8);
    anvil.fillStyle(0x777777, 1);
    anvil.fillRect(10, 0, 100, 15);
    anvil.generateTexture('anvil', 120, 70);
    anvil.destroy();
  }
}
