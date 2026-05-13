import Phaser from 'phaser';

export class ProgressBar extends Phaser.GameObjects.Container {
  private bgRect: Phaser.GameObjects.Rectangle;
  private fillRect: Phaser.GameObjects.Rectangle;
  private barWidth: number;

  private label?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: number,
    bgColor: number = 0x333333,
    showLabel = false,
  ) {
    super(scene, x, y);

    this.barWidth = width;


    this.bgRect = scene.add.rectangle(0, 0, width, height, bgColor).setOrigin(0, 0.5);
    this.add(this.bgRect);

    this.fillRect = scene.add.rectangle(0, 0, width, height, fillColor).setOrigin(0, 0.5);
    this.add(this.fillRect);

    if (showLabel) {
      this.label = scene.add.text(width / 2, 0, '', {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }).setOrigin(0.5);
      this.add(this.label);
    }

    scene.add.existing(this);
  }

  setValue(current: number, max: number): void {
    const ratio = Math.max(0, Math.min(1, current / max));
    this.fillRect.width = this.barWidth * ratio;
    if (this.label) {
      this.label.setText(`${Math.ceil(current)}/${max}`);
    }
  }

  setFillColor(color: number): void {
    this.fillRect.setFillStyle(color);
  }
}
