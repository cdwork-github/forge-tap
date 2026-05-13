import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  create(): void {
    this.add.text(195, 380, 'FORGE TAP', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 440, '⚒️', {
      fontSize: '64px',
    }).setOrigin(0.5);

    this.time.delayedCall(800, () => {
      this.scene.start('Preload');
    });
  }
}
