import Phaser from 'phaser';
import { GameStore } from '@/state/GameStore';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';

interface TutorialPage {
  title: string;
  icon: string;
  text: string;
}

const PAGES: TutorialPage[] = [
  {
    title: 'Welcome to FORGE TAP',
    icon: '⚒️',
    text: 'Tap ore veins to mine materials\nand forge powerful items.',
  },
  {
    title: 'Choose Your Element',
    icon: '🔥💧🌿🌀',
    text: 'Fire, Water, Earth, and Void.\nEach element has unique materials\nand combat styles.',
  },
  {
    title: 'Forge & Craft',
    icon: '🔨',
    text: 'Every 50 taps forges a new material.\nCombine materials into Relics —\npowerful passive bonuses.',
  },
  {
    title: 'Enter the Dungeon',
    icon: '⚔️',
    text: 'Play cards to fight enemies\nin roguelike dungeon runs.\nMaterials you earn transfer\nto your collection.',
  },
  {
    title: 'Start Forging!',
    icon: '✨',
    text: 'Tap the ore to begin your journey.',
  },
];

export class TutorialScene extends Phaser.Scene {
  private currentPage = 0;
  private contentContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'Tutorial' });
  }

  create(): void {
    this.currentPage = 0;
    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    this.contentContainer = this.add.container(0, 0);
    this.renderPage();
  }

  private renderPage(): void {
    this.contentContainer.removeAll(true);

    const page = PAGES[this.currentPage];
    const isLast = this.currentPage === PAGES.length - 1;

    // Page indicator dots
    const dotsY = 140;
    for (let i = 0; i < PAGES.length; i++) {
      const dotX = 195 - ((PAGES.length - 1) * 12) / 2 + i * 12;
      const dot = this.add.circle(dotX, dotsY, 4, i === this.currentPage ? COLORS.accent : COLORS.surfaceLight);
      this.contentContainer.add(dot);
    }

    // Icon
    const icon = this.add.text(195, 280, page.icon, {
      fontSize: '64px',
    }).setOrigin(0.5);
    this.contentContainer.add(icon);

    // Title
    const title = this.add.text(195, 380, page.title, {
      fontSize: '22px', color: hexToString(COLORS.text), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.contentContainer.add(title);

    // Text
    const text = this.add.text(195, 440, page.text, {
      fontSize: '14px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      align: 'center', lineSpacing: 6,
    }).setOrigin(0.5, 0);
    this.contentContainer.add(text);

    if (isLast) {
      const startBtn = new Button(this, 195, 620, 200, 56, 'START', COLORS.accent);
      startBtn.onClick(() => {
        GameStore.getInstance().completeTutorial();
        this.scene.start('MainGame');
      });
      this.contentContainer.add(startBtn);
    } else {
      // Tap to continue
      const hint = this.add.text(195, 700, 'tap to continue', {
        fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setOrigin(0.5);
      this.contentContainer.add(hint);

      // Pulse the hint
      this.tweens.add({
        targets: hint,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      // Tap anywhere to advance
      this.input.once('pointerdown', () => {
        this.currentPage++;
        this.renderPage();
      });
    }
  }
}
