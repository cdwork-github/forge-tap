import Phaser from 'phaser';
import { Material } from '@/models/Material';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { hexToString } from '@/utils/colors';

export class MaterialCard extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    material: Material,
    count?: number,
  ) {
    super(scene, x, y);

    const cardW = 85;
    const cardH = 100;
    const rarityColor = RARITY_CONFIG[material.rarity].color;

    // Border / background
    const bg = scene.add.graphics();
    bg.fillStyle(0x16213e, 1);
    bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
    bg.lineStyle(2, rarityColor, 1);
    bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
    this.add(bg);

    // Material color swatch
    const swatch = scene.add.rectangle(0, -15, 32, 32, material.color);
    this.add(swatch);

    // Material name
    const name = scene.add.text(0, 18, material.name, {
      fontSize: '10px',
      color: hexToString(rarityColor),
      fontFamily: 'monospace',
      wordWrap: { width: cardW - 10 },
      align: 'center',
    }).setOrigin(0.5, 0);
    this.add(name);

    // Count badge
    if (count !== undefined && count > 1) {
      const badge = scene.add.text(
        cardW / 2 - 6,
        -cardH / 2 + 6,
        `x${count}`,
        {
          fontSize: '11px',
          color: '#ffffff',
          fontFamily: 'monospace',
          backgroundColor: '#e94560',
          padding: { x: 3, y: 1 },
        },
      ).setOrigin(1, 0);
      this.add(badge);
    }

    scene.add.existing(this);
  }
}
