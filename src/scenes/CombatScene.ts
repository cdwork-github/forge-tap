import Phaser from 'phaser';
import { CombatStore } from '@/state/CombatStore';
import { RunStore } from '@/state/RunStore';
import { ACTS } from '@/data/enemies';
import { Card } from '@/models/Card';
import { EnemyInstance } from '@/models/Enemy';
import { StatusEffectId, STATUS_EFFECTS } from '@/models/StatusEffect';
import { Button } from '@/ui/Button';
import { ProgressBar } from '@/ui/ProgressBar';
import { COLORS, hexToString, FONT } from '@/utils/colors';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { ORE_CONFIG } from '@/data/oreConfig';
import { pickRandom } from '@/utils/random';
import { NodeType } from '@/models/MapNode';

interface CombatData {
  nodeType: NodeType;
  actId: string;
}

export class CombatScene extends Phaser.Scene {
  private combat!: CombatStore;
  private run!: RunStore;
  private handCards: Phaser.GameObjects.Container[] = [];
  private enemyDisplays: Phaser.GameObjects.Container[] = [];
  private hpBar!: ProgressBar;
  private energyText!: Phaser.GameObjects.Text;
  private blockText!: Phaser.GameObjects.Text;
  private pileText!: Phaser.GameObjects.Text;
  private statusContainer!: Phaser.GameObjects.Container;
  private endTurnBtn!: Button;
  private oreBtn!: Button;
  private selectedIndex: number | null = null;
  private isAnimating = false;
  private targetPrompt?: Phaser.GameObjects.Text;
  private turnBanner?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'Combat' });
  }

  init(data: CombatData): void {
    this.combat = CombatStore.getInstance();
    this.run = RunStore.getInstance();

    const runState = this.run.getState();
    const act = ACTS.find((a) => a.id === data.actId);
    if (!act) return;

    // Pick enemies based on node type
    let enemyIds: string[];
    if (data.nodeType === 'boss') {
      enemyIds = [act.bossId];
    } else if (data.nodeType === 'elite') {
      enemyIds = [pickRandom(act.eliteEnemyIds)];
      if (Math.random() > 0.6) {
        enemyIds.push(pickRandom(act.basicEnemyIds));
      }
    } else {
      const count = Math.random() > 0.5 ? 2 : 1;
      enemyIds = Array.from({ length: count }, () => pickRandom(act.basicEnemyIds));
    }

    this.combat.initCombat(
      runState.deck,
      runState.hp,
      runState.maxHp,
      runState.maxEnergy,
      enemyIds,
    );
  }

  create(): void {
    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    this.createTopBar();
    this.createEnemyZone();
    this.createMiddleZone();
    this.createHandZone();
    this.createBottomBar();

    // Listen to combat events
    this.combat.on('card-played', this.onCardPlayed);
    this.combat.on('player-turn-started', this.onPlayerTurnStarted);
    this.combat.on('player-turn-ended', this.onPlayerTurnEnded);
    this.combat.on('combat-victory', this.onVictory);
    this.combat.on('combat-defeat', this.onDefeat);
    this.combat.on('enemy-died', this.onEnemyDied);
    this.combat.on('ore-tapped', this.refreshAll);

    this.events.on('shutdown', () => {
      this.combat.off('card-played', this.onCardPlayed);
      this.combat.off('player-turn-started', this.onPlayerTurnStarted);
      this.combat.off('player-turn-ended', this.onPlayerTurnEnded);
      this.combat.off('combat-victory', this.onVictory);
      this.combat.off('combat-defeat', this.onDefeat);
      this.combat.off('enemy-died', this.onEnemyDied);
      this.combat.off('ore-tapped', this.refreshAll);
      CombatStore.reset();
    });

    this.refreshAll();

    // Target prompt (hidden initially)
    this.targetPrompt = this.add.text(195, 135, '▼ TAP AN ENEMY TO TARGET ▼', {
      fontSize: '11px', color: hexToString(COLORS.gold), fontFamily: FONT.body, fontStyle: 'bold',
      backgroundColor: '#000000', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setVisible(false).setDepth(100);

    // Turn banner
    this.turnBanner = this.add.text(195, 422, '', {
      fontSize: '20px', color: hexToString(COLORS.text), fontFamily: FONT.body, fontStyle: 'bold',
      backgroundColor: '#000000', padding: { x: 20, y: 8 },
    }).setOrigin(0.5).setAlpha(0).setDepth(200);

    // Deselect background — sits behind all interactive elements
    const deselectBg = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.001)
      .setInteractive()
      .setDepth(0);
    deselectBg.on('pointerdown', () => {
      if (this.selectedIndex !== null) {
        this.selectedIndex = null;
        this.combat.selectCard(-1);
        this.refreshHand();
        this.updateTargetPrompt();
      }
    });
  }

  // === UI CREATION ===

  private createTopBar(): void {
    this.hpBar = new ProgressBar(this, 15, 18, 150, 14, COLORS.energy, 0x333333, true);
    this.blockText = this.add.text(180, 18, '', {
      fontSize: '12px', color: hexToString(0x64b5f6), fontFamily: 'monospace',
    }).setOrigin(0, 0.5);

    this.add.text(370, 18, '', { fontSize: '12px', color: hexToString(COLORS.gold), fontFamily: 'monospace' })
      .setOrigin(1, 0.5);
  }

  private createEnemyZone(): void {
    // Enemies rendered in refreshEnemies
  }

  private createMiddleZone(): void {
    this.statusContainer = this.add.container(20, 480).setDepth(5);

    // Ore tap button
    this.oreBtn = new Button(this, 195, 510, 220, 36, '⛏ Mine Ore: +1 Energy, -3 HP', COLORS.surfaceLight);
    this.oreBtn.setDepth(10);
    this.oreBtn.onClick(() => {
      if (this.isAnimating) return;
      this.combat.tapOre();
      this.refreshAll();
    });
  }

  private createHandZone(): void {
    // Cards rendered in refreshHand
  }

  private createBottomBar(): void {
    this.energyText = this.add.text(30, 780, '', {
      fontSize: '18px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.pileText = this.add.text(30, 810, '', {
      fontSize: '11px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    });

    this.endTurnBtn = new Button(this, 320, 790, 120, 44, 'END TURN', COLORS.accent);
    this.endTurnBtn.setDepth(10);
    this.endTurnBtn.onClick(() => {
      if (this.isAnimating) return;
      this.combat.endPlayerTurn();
    });
  }

  // === REFRESH DISPLAYS ===

  private refreshAll = (): void => {
    const state = this.combat.getState();

    // HP
    this.hpBar.setValue(state.playerHp, state.playerMaxHp);
    this.hpBar.setFillColor(state.playerHp < 20 ? COLORS.energyLow : COLORS.energy);

    // Block
    this.blockText.setText(state.playerBlock > 0 ? `🛡${state.playerBlock}` : '');

    // Energy
    this.energyText.setText(`⚡${state.playerEnergy}/${state.playerMaxEnergy}`);

    // Piles
    this.pileText.setText(`Draw: ${state.drawPile.length}  Disc: ${state.discardPile.length}  Exh: ${state.exhaustPile.length}`);

    // Ore button
    this.oreBtn.setLabel(state.oreTapped ? '⛏ USED' : '⛏ Mine Ore: +1 Energy, -3 HP');

    this.refreshEnemies();
    this.refreshHand();
    this.refreshStatuses();
  };

  private refreshEnemies(): void {
    this.enemyDisplays.forEach((d) => d.destroy());
    this.enemyDisplays = [];

    const state = this.combat.getState();
    const enemies = state.enemies;
    const spacing = Math.min(130, 350 / Math.max(enemies.length, 1));
    const startX = 195 - ((enemies.length - 1) * spacing) / 2;

    enemies.forEach((enemy, i) => {
      const x = startX + i * spacing;
      const y = 180;
      const container = this.createEnemyDisplay(enemy, x, y, i);
      container.setDepth(5);
      this.enemyDisplays.push(container);
    });
  }

  private createEnemyDisplay(enemy: EnemyInstance, x: number, y: number, index: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Enemy body
    const def = COLORS.accent;
    const body = this.add.circle(0, 0, 35, def, 0.8);
    container.add(body);

    // Name
    const name = this.add.text(0, -55, enemy.name, {
      fontSize: '11px', color: hexToString(COLORS.text), fontFamily: 'monospace',
    }).setOrigin(0.5);
    container.add(name);

    // HP bar
    const hpBg = this.add.rectangle(0, 48, 76, 12, 0x333333).setOrigin(0.5);
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
    const hpFill = this.add.rectangle(-38, 48, 76 * hpRatio, 12, enemy.hp < enemy.maxHp * 0.3 ? COLORS.energyLow : COLORS.energy).setOrigin(0, 0.5);
    const hpText = this.add.text(0, 48, `${enemy.hp}/${enemy.maxHp}`, {
      fontSize: '11px', color: '#fff', fontFamily: FONT.mono,
    }).setOrigin(0.5);
    container.add([hpBg, hpFill, hpText]);

    // Block
    if (enemy.block > 0) {
      const blockBadge = this.add.text(30, -30, `🛡${enemy.block}`, {
        fontSize: '11px', color: hexToString(0x64b5f6), fontFamily: 'monospace',
      });
      container.add(blockBadge);
    }

    // Intent
    const intentText = this.formatIntent(enemy.currentIntent);
    const intent = this.add.text(0, -70, intentText, {
      fontSize: '12px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(intent);

    // Status effects
    let sx = -30;
    for (const [statusId, stacks] of enemy.statuses) {
      const def = STATUS_EFFECTS[statusId as StatusEffectId];
      if (def && stacks > 0) {
        const badge = this.add.text(sx, 64, `${def.name.substring(0, 3)}${stacks}`, {
          fontSize: '10px', color: hexToString(def.color), fontFamily: FONT.mono,
          backgroundColor: '#111111', padding: { x: 2, y: 1 },
        });
        container.add(badge);
        sx += 32;
      }
    }

    // Make interactive for targeting
    body.setInteractive({
      hitArea: new Phaser.Geom.Circle(0, 0, 50),
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      useHandCursor: true,
    });
    body.on('pointerdown', () => {
      if (this.selectedIndex !== null && !this.isAnimating) {
        const cardContainer = this.handCards[this.selectedIndex];
        if (cardContainer) {
          this.isAnimating = true;
          // Animate card flying toward enemy
          this.tweens.add({
            targets: cardContainer,
            x, y,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
              // Flash enemy on hit
              this.tweens.add({
                targets: body,
                alpha: 0.3,
                duration: 80,
                yoyo: true,
                repeat: 1,
              });
              this.combat.playCard(index);
              this.selectedIndex = null;
              this.isAnimating = false;
              this.updateTargetPrompt();
              this.refreshAll();
            },
          });
        } else {
          this.combat.playCard(index);
          this.selectedIndex = null;
          this.updateTargetPrompt();
          this.refreshAll();
        }
      }
    });

    return container;
  }

  private formatIntent(intent: EnemyInstance['currentIntent']): string {
    switch (intent.type) {
      case 'attack': return `⚔️${intent.damage ?? 0}`;
      case 'multi_attack': return `⚔️${intent.damage ?? 0}×${intent.hits ?? 1}`;
      case 'block': return `🛡️${intent.block ?? 0}`;
      case 'buff': return '⬆️';
      case 'debuff': return '⬇️';
      case 'heal': return `💚${intent.healAmount ?? 0}`;
      case 'summon': return '📢';
      default: return '❓';
    }
  }

  private refreshHand(): void {
    this.handCards.forEach((c) => c.destroy());
    this.handCards = [];

    const state = this.combat.getState();
    const hand = state.hand;
    const baseCardW = 80;
    const y = 670;

    // Overlapping fan layout: cards overlap when hand is large
    const maxTotalW = 370;
    const spacing = hand.length <= 4 ? baseCardW + 4 : Math.min(baseCardW + 4, maxTotalW / hand.length);
    const totalW = hand.length * spacing - (spacing - baseCardW);
    const startX = (390 - totalW) / 2 + baseCardW / 2;

    hand.forEach((card, i) => {
      const x = startX + i * spacing;
      const container = this.createCardDisplay(card, x, y, i);
      container.setDepth(10 + i);
      this.handCards.push(container);
    });
  }

  private createCardDisplay(card: Card, x: number, y: number, index: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const state = this.combat.getState();
    const canPlay = card.cost <= state.playerEnergy && card.cost >= 0 && state.isPlayerTurn;

    const w = 78;
    const h = 108;
    const rarityColor = RARITY_CONFIG[card.rarity].color;
    const oreColor = card.oreType === 'colorless' ? COLORS.textMuted : ORE_CONFIG[card.oreType as keyof typeof ORE_CONFIG].color;
    const alpha = canPlay ? 1 : 0.45;
    const isSelected = index === this.selectedIndex;

    // Card background with better contrast
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.cardBg, alpha);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(isSelected ? 3 : 2, isSelected ? 0xffffff : rarityColor, alpha);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    container.add(bg);

    // Cost circle
    const costCircle = this.add.circle(-w / 2 + 13, -h / 2 + 13, 11, COLORS.background);
    const costText = this.add.text(-w / 2 + 13, -h / 2 + 13, `${card.cost}`, {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: FONT.mono, fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add([costCircle, costText]);

    // Ore color bar
    const typeBar = this.add.rectangle(0, -h / 2 + 5, w - 26, 4, oreColor, alpha);
    container.add(typeBar);

    // Card name
    const name = this.add.text(0, -14, card.name, {
      fontSize: '11px', color: hexToString(COLORS.text), fontFamily: FONT.body, fontStyle: 'bold',
      wordWrap: { width: w - 10 }, align: 'center',
    }).setOrigin(0.5).setAlpha(alpha);
    container.add(name);

    // Card type
    const typeLabel = card.type.charAt(0).toUpperCase() + card.type.slice(1);
    const typeTxt = this.add.text(0, 4, typeLabel, {
      fontSize: '9px', color: hexToString(rarityColor), fontFamily: FONT.body,
    }).setOrigin(0.5).setAlpha(alpha);
    container.add(typeTxt);

    // Description
    const desc = this.add.text(0, 22, card.description, {
      fontSize: '8px', color: hexToString(COLORS.textMuted), fontFamily: FONT.body,
      wordWrap: { width: w - 10 }, align: 'center', lineSpacing: 1,
    }).setOrigin(0.5, 0).setAlpha(alpha);
    container.add(desc);

    // Keywords
    if (card.keywords.length > 0) {
      const kw = this.add.text(0, h / 2 - 12, card.keywords.join(' '), {
        fontSize: '8px', color: hexToString(0xff6b35), fontFamily: FONT.body, fontStyle: 'italic',
      }).setOrigin(0.5).setAlpha(alpha);
      container.add(kw);
    }

    // Interaction
    if (canPlay) {
      container.setSize(w, h);
      container.setInteractive({ useHandCursor: true });
      container.on('pointerdown', () => {
        if (this.isAnimating) return;
        if (this.selectedIndex === index) {
          this.selectedIndex = null;
          this.combat.selectCard(-1);
        } else {
          this.selectedIndex = index;
          this.combat.selectCard(index);
        }
        this.refreshHand();
        this.updateTargetPrompt();
      });
    }

    // Selected: float up
    if (isSelected) {
      container.setY(y - 15);
    }

    return container;
  }

  private refreshStatuses(): void {
    this.statusContainer.removeAll(true);
    const state = this.combat.getState();
    let sx = 0;

    for (const [statusId, stacks] of state.playerStatuses) {
      const def = STATUS_EFFECTS[statusId as StatusEffectId];
      if (def && stacks > 0) {
        const badge = this.add.text(sx, 0, `${def.name}: ${stacks}`, {
          fontSize: '10px', color: hexToString(def.color), fontFamily: 'monospace',
          backgroundColor: '#111111', padding: { x: 3, y: 1 },
        });
        this.statusContainer.add(badge);
        sx += badge.width + 6;
      }
    }
  }

  private updateTargetPrompt(): void {
    if (this.targetPrompt) {
      this.targetPrompt.setVisible(this.selectedIndex !== null);
    }
  }

  private showFloatingText(x: number, y: number, text: string, color: number): void {
    const floater = this.add.text(x, y, text, {
      fontSize: '18px', color: hexToString(color), fontFamily: FONT.mono, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(150);

    this.tweens.add({
      targets: floater,
      y: y - 50,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      onComplete: () => floater.destroy(),
    });
  }

  private showTurnBanner(text: string, color: number): void {
    if (!this.turnBanner) return;
    this.turnBanner.setText(text);
    this.turnBanner.setColor(hexToString(color));
    this.turnBanner.setAlpha(1);
    this.tweens.add({
      targets: this.turnBanner,
      alpha: 0,
      duration: 400,
      delay: 600,
      ease: 'Power2',
    });
  }

  // === EVENT HANDLERS ===

  private onCardPlayed = (): void => {
    this.selectedIndex = null;
    this.updateTargetPrompt();
    this.refreshAll();
  };

  private onPlayerTurnStarted = (): void => {
    this.selectedIndex = null;
    this.isAnimating = false;
    this.updateTargetPrompt();
    this.showTurnBanner('YOUR TURN', COLORS.energy);
    this.refreshAll();
  };

  private onPlayerTurnEnded = (): void => {
    this.isAnimating = true;
    this.updateTargetPrompt();
    this.showTurnBanner('ENEMY TURN', COLORS.energyLow);

    // Brief delay then execute enemy turns
    this.time.delayedCall(800, () => {
      this.combat.executeEnemyTurns();
    });
  };

  private onEnemyDied = (_enemyIndex: unknown): void => {
    this.showFloatingText(195, 200, 'DEFEATED!', COLORS.gold);
    this.cameras.main.shake(100, 0.005);
    this.refreshAll();
  };

  private onVictory = (): void => {
    this.isAnimating = true;

    // Award gold
    const gold = 15 + Math.floor(Math.random() * 6);
    this.run.addGold(gold);

    // Update run HP from combat
    const state = this.combat.getState();
    const runState = this.run.getState();
    // Sync HP back — need to heal/damage to match
    const hpDiff = state.playerHp - runState.hp;
    if (hpDiff > 0) this.run.heal(hpDiff);
    else if (hpDiff < 0) this.run.takeDamage(-hpDiff);

    // Victory overlay
    this.time.delayedCall(500, () => {
      const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.8);
      this.add.text(195, 300, 'VICTORY!', {
        fontSize: '36px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5);

      this.add.text(195, 360, `+${gold} Gold`, {
        fontSize: '18px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
      }).setOrigin(0.5);

      new Button(this, 195, 460, 200, 48, 'CONTINUE', COLORS.accent)
        .onClick(() => {
          this.scene.stop('Combat');
          const runState = this.run.getState();
          if (runState.currentFloor >= 10) {
            this.run.endRun(true);
            this.showRunEnd(true);
          } else {
            this.scene.launch('Reward', {
              nodeType: this.scene.settings.data ? (this.scene.settings.data as CombatData).nodeType : 'combat',
              gold,
            });
          }
        });

      void overlay;
    });
  };

  private onDefeat = (): void => {
    this.isAnimating = true;

    // Sync HP
    const state = this.combat.getState();
    const runState = this.run.getState();
    const hpDiff = state.playerHp - runState.hp;
    if (hpDiff < 0) this.run.takeDamage(-hpDiff);

    this.time.delayedCall(500, () => {
      const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.9);
      this.add.text(195, 300, 'DEFEATED', {
        fontSize: '36px', color: hexToString(COLORS.energyLow), fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5);

      this.add.text(195, 360, `Floor ${this.run.getState().currentFloor}/10`, {
        fontSize: '16px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setOrigin(0.5);

      new Button(this, 195, 460, 200, 48, 'RETURN', COLORS.surfaceLight)
        .onClick(() => {
          this.run.endRun(false);
          this.showRunEnd(false);
        });

      void overlay;
    });
  };

  private showRunEnd(victory: boolean): void {
    this.scene.stop('Combat');
    this.scene.launch('RunSummary', { victory });
  }
}
