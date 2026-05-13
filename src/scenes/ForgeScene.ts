import Phaser from 'phaser';
import { OreType, Rarity } from '@/models/types';
import { ORE_CONFIG, OreConfig } from '@/data/oreConfig';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { GameStore } from '@/state/GameStore';
import { Button } from '@/ui/Button';
import { MaterialCard } from '@/ui/MaterialCard';
import { getWeightedRarity, pickRandom } from '@/utils/random';
import { getMaterialsByOreAndRarity } from '@/data/materials';
import { COLORS, hexToString } from '@/utils/colors';

export class ForgeScene extends Phaser.Scene {
  private oreType!: OreType;

  constructor() {
    super({ key: 'Forge' });
  }

  init(data: { oreType: OreType }): void {
    this.oreType = data.oreType;
  }

  create(): void {
    const store = GameStore.getInstance();
    const oreConfig = ORE_CONFIG[this.oreType];

    // Dark overlay fade in
    const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0);
    this.tweens.add({
      targets: overlay,
      alpha: 0.85,
      duration: 200,
    });

    // Anvil drops in
    const anvil = this.add.image(195, -50, 'anvil');
    this.tweens.add({
      targets: anvil,
      y: 350,
      duration: 500,
      ease: 'Bounce.easeOut',
      onComplete: () => this.playForgeAnimation(anvil, store, oreConfig),
    });
  }

  private playForgeAnimation(
    anvil: Phaser.GameObjects.Image,
    store: GameStore,
    oreConfig: OreConfig,
  ): void {
    // Sparks from anvil
    const particleKey = `particle-${this.oreType}`;
    if (this.textures.exists(particleKey)) {
      const emitter = this.add.particles(195, 330, particleKey, {
        speed: { min: 80, max: 200 },
        angle: { min: 220, max: 320 },
        lifespan: 600,
        gravityY: 200,
        quantity: 3,
        frequency: 80,
        scale: { start: 2, end: 0 },
      });

      this.time.delayedCall(1200, () => emitter.stop());
      this.time.delayedCall(2000, () => emitter.destroy());
    }

    // Determine result -- retry with Common if no materials exist for rolled rarity
    let rarity = getWeightedRarity();
    let materials = getMaterialsByOreAndRarity(this.oreType, rarity);
    if (materials.length === 0) {
      rarity = Rarity.Common;
      materials = getMaterialsByOreAndRarity(this.oreType, rarity);
    }
    const material = pickRandom(materials);
    const rarityConfig = RARITY_CONFIG[rarity];

    // Reveal after spark animation
    this.time.delayedCall(1500, () => {
      // Add material to state
      store.addMaterial(material.id);

      // Material card reveal
      const card = new MaterialCard(this, 195, 260, material);
      card.setAlpha(0);
      card.setScale(0.5);
      this.tweens.add({
        targets: card,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 400,
        ease: 'Back.easeOut',
      });

      // Rarity label
      const rarityLabel = this.add.text(195, 325, rarityConfig.label.toUpperCase(), {
        fontSize: '20px',
        color: hexToString(rarityConfig.color),
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: rarityLabel,
        alpha: 1,
        duration: 300,
        delay: 200,
      });

      // Material name
      const nameLabel = this.add.text(195, 355, material.name, {
        fontSize: '16px',
        color: hexToString(COLORS.text),
        fontFamily: 'monospace',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: nameLabel,
        alpha: 1,
        duration: 300,
        delay: 300,
      });

      // Rarity-specific effects
      this.playRarityEffect(rarity);

      // Buttons
      this.time.delayedCall(600, () => {
        new Button(this, 130, 500, 130, 44, 'FORGE AGAIN', oreConfig.color)
          .onClick(() => {
            this.scene.stop('Forge');
            this.scene.resume('MainGame');
          });

        new Button(this, 265, 500, 130, 44, 'INVENTORY', COLORS.surfaceLight)
          .onClick(() => {
            this.scene.stop('Forge');
            this.scene.resume('MainGame');
            this.scene.sleep('MainGame');
            this.scene.launch('Inventory');
          });
      });
    });

    void anvil;
  }

  private playRarityEffect(rarity: Rarity): void {
    const config = RARITY_CONFIG[rarity];

    if (rarity === Rarity.Legendary) {
      this.cameras.main.shake(200, 0.01);
      // Gold particle fountain
      if (this.textures.exists('particle-gold')) {
        const fountain = this.add.particles(195, 250, 'particle-gold', {
          speed: { min: 100, max: 250 },
          angle: { min: 230, max: 310 },
          lifespan: 800,
          gravityY: 300,
          quantity: 5,
          frequency: 50,
          scale: { start: 2.5, end: 0 },
        });
        this.time.delayedCall(1500, () => fountain.stop());
        this.time.delayedCall(2500, () => fountain.destroy());
      }
      // Flash
      this.cameras.main.flash(300, 255, 215, 0);
    } else if (rarity === Rarity.Epic) {
      this.cameras.main.flash(200, 156, 39, 176);
    } else if (rarity === Rarity.Rare) {
      this.cameras.main.flash(150, 33, 150, 243);
    }

    // Burst particles proportional to rarity
    const particleKey = `particle-${this.oreType}`;
    if (this.textures.exists(particleKey) && config.particleCount > 10) {
      const burst = this.add.particles(195, 280, particleKey, {
        speed: { min: 30, max: 120 },
        lifespan: 500,
        scale: { start: 1.5, end: 0 },
        emitting: false,
      });
      burst.explode(config.particleCount);
      this.time.delayedCall(600, () => burst.destroy());
    }
  }
}
