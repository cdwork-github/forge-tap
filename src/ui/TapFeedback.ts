import Phaser from 'phaser';
import { OreType } from '@/models/types';
import { ORE_CONFIG } from '@/data/oreConfig';
import { hexToString } from '@/utils/colors';

export class TapFeedback {
  static play(scene: Phaser.Scene, x: number, y: number, oreType: OreType): void {
    const config = ORE_CONFIG[oreType];

    // Floating "+1" text
    const text = scene.add.text(x, y - 20, '+1', {
      fontSize: '24px',
      color: hexToString(config.color),
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: text,
      y: y - 80,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    // Particle burst
    const particleKey = `particle-${oreType}`;
    if (scene.textures.exists(particleKey)) {
      const emitter = scene.add.particles(x, y, particleKey, {
        speed: { min: 50, max: 150 },
        angle: { min: 200, max: 340 },
        lifespan: 400,
        quantity: 8,
        scale: { start: 1.5, end: 0 },
        emitting: false,
      });
      emitter.explode();
      scene.time.delayedCall(500, () => emitter.destroy());
    }

    // Camera shake
    scene.cameras.main.shake(50, 0.003);
  }
}
