import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { GameStore } from '@/state/GameStore';
import { Button } from '@/ui/Button';
import { COLORS, hexToString, FONT } from '@/utils/colors';

interface RunSummaryData {
  victory: boolean;
}

export class RunSummaryScene extends Phaser.Scene {
  private victory = false;

  constructor() {
    super({ key: 'RunSummary' });
  }

  init(data: RunSummaryData): void {
    this.victory = data.victory;
  }

  create(): void {
    const run = RunStore.getInstance();
    const runState = run.getState();

    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    // Victory / Defeat header
    const headerColor = this.victory ? COLORS.gold : COLORS.energyLow;
    const headerText = this.victory ? 'VICTORY!' : 'DEFEATED';

    this.add.text(195, 60, headerText, {
      fontSize: '32px', color: hexToString(headerColor), fontFamily: FONT.body, fontStyle: 'bold',
    }).setOrigin(0.5);

    const emoji = this.victory ? '🏆' : '💀';
    this.add.text(195, 110, emoji, { fontSize: '48px' }).setOrigin(0.5);

    // Stats section
    const statsY = 200;
    const lineH = 36;
    const stats: { label: string; value: string; color?: number }[] = [
      { label: 'Floors Cleared', value: `${runState.currentFloor} / 10` },
      { label: 'Gold Earned', value: `${runState.gold}`, color: COLORS.gold },
      { label: 'Deck Size', value: `${runState.deck.length} cards` },
      { label: 'Relics', value: `${runState.relicIds.length}` },
    ];

    // Count materials earned
    const totalMats = Object.values(runState.materialsEarned).reduce((s, n) => s + n, 0);
    stats.push({ label: 'Materials Earned', value: `${totalMats}`, color: COLORS.accent });

    this.add.text(195, statsY - 20, 'RUN SUMMARY', {
      fontSize: '14px', color: hexToString(COLORS.textMuted), fontFamily: FONT.body,
    }).setOrigin(0.5);

    stats.forEach((stat, i) => {
      const y = statsY + 15 + i * lineH;

      this.add.text(40, y, stat.label, {
        fontSize: '13px', color: hexToString(COLORS.textMuted), fontFamily: FONT.body,
      }).setOrigin(0, 0.5);

      this.add.text(350, y, stat.value, {
        fontSize: '14px', color: hexToString(stat.color ?? COLORS.text),
        fontFamily: FONT.mono, fontStyle: 'bold',
      }).setOrigin(1, 0.5);

      // Separator line
      const sep = this.add.graphics();
      sep.lineStyle(1, COLORS.surfaceLight, 0.3);
      sep.lineBetween(40, y + lineH / 2, 350, y + lineH / 2);
    });

    // Materials detail (if any earned)
    const matEntries = Object.entries(runState.materialsEarned).filter(([, c]) => c > 0);
    if (matEntries.length > 0) {
      const matY = statsY + 15 + stats.length * lineH + 20;
      this.add.text(195, matY, 'MATERIALS COLLECTED', {
        fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: FONT.body,
      }).setOrigin(0.5);

      const matListY = matY + 25;
      matEntries.forEach(([matId, count], i) => {
        const name = matId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        this.add.text(60, matListY + i * 22, `${name}  x${count}`, {
          fontSize: '11px', color: hexToString(COLORS.text), fontFamily: FONT.body,
        });
      });
    }

    // Transfer materials to permanent store
    const gameStore = GameStore.getInstance();
    gameStore.recordRunEnd(this.victory, runState.materialsEarned);
    if (this.victory) {
      gameStore.incrementAscension(runState.actId);
    }

    // Continue button
    new Button(this, 195, 740, 200, 52, 'CONTINUE', this.victory ? COLORS.accent : COLORS.surfaceLight)
      .onClick(() => {
        RunStore.reset();
        this.scene.stop('RunSummary');
        this.scene.wake('MainGame');
      });
  }
}
