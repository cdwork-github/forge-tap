import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private callback?: () => void;
  private bgColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    color: number = 0xe94560,
  ) {
    super(scene, x, y);

    this.bgColor = color;
    this.bg = scene.add.graphics();
    this.drawBg(width, height, color, false);
    this.add(this.bg);

    this.label = scene.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.label);

    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => this.setScale(0.95));
    this.on('pointerup', () => {
      this.setScale(1);
      this.callback?.();
    });
    this.on('pointerout', () => this.setScale(1));

    scene.add.existing(this);
  }

  onClick(cb: () => void): this {
    this.callback = cb;
    return this;
  }

  setLabel(text: string): void {
    this.label.setText(text);
  }

  setColor(color: number): void {
    this.bgColor = color;
    this.drawBg(this.width, this.height, color, false);
  }

  setHighlight(highlighted: boolean): void {
    this.drawBg(this.width, this.height, this.bgColor, highlighted);
  }

  private drawBg(w: number, h: number, color: number, highlighted: boolean): void {
    this.bg.clear();
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    if (highlighted) {
      this.bg.lineStyle(3, 0xffffff, 1);
      this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
    }
  }
}
