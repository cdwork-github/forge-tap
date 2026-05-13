import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { Card } from '@/models/Card';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { ORE_CONFIG } from '@/data/oreConfig';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';
import { upgradeCard } from '@/utils/cardUpgrade';


export class RestScene extends Phaser.Scene {
  private run!: RunStore;
  private contentContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'RestScene' });
  }

  create(): void {
    this.run = RunStore.getInstance();

    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    this.add.text(195, 40, 'REST SITE', {
      fontSize: '24px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 80, '🔥', { fontSize: '48px' }).setOrigin(0.5);

    const state = this.run.getState();
    this.add.text(195, 120, `HP: ${state.hp}/${state.maxHp}`, {
      fontSize: '14px', color: hexToString(state.hp < state.maxHp * 0.5 ? COLORS.energyLow : COLORS.energy),
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.contentContainer = this.add.container(0, 0);
    this.renderChoice();
  }

  private clearContent(): void {
    this.contentContainer.removeAll(true);
  }

  private renderChoice(): void {
    this.clearContent();

    const state = this.run.getState();
    const healAmount = Math.floor(state.maxHp * 0.3);
    const hasUpgradable = state.deck.some((c) => !c.upgraded);

    // Rest option
    const restBtn = new Button(this, 195, 240, 280, 60, '', COLORS.energy);
    const restLabel = this.add.text(195, 230, `REST`, {
      fontSize: '18px', color: hexToString(COLORS.text), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    const restDesc = this.add.text(195, 252, `Heal ${healAmount} HP`, {
      fontSize: '12px', color: hexToString(COLORS.text), fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.contentContainer.add([restBtn, restLabel, restDesc]);

    restBtn.onClick(() => {
      this.run.heal(healAmount);
      this.returnToMap();
    });

    // Upgrade option
    const upgradeColor = hasUpgradable ? COLORS.accent : 0x555555;
    const upgradeBtn = new Button(this, 195, 340, 280, 60, '', upgradeColor);
    const upgLabel = this.add.text(195, 330, 'UPGRADE', {
      fontSize: '18px', color: hexToString(COLORS.text), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    const upgDesc = this.add.text(195, 352, 'Improve one card in your deck', {
      fontSize: '12px', color: hexToString(hasUpgradable ? COLORS.text : COLORS.textMuted),
      fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.contentContainer.add([upgradeBtn, upgLabel, upgDesc]);

    if (hasUpgradable) {
      upgradeBtn.onClick(() => this.renderCardPicker());
    }

    // Remove card option
    const removeBtn = new Button(this, 195, 440, 280, 60, '', COLORS.surfaceLight);
    const rmLabel = this.add.text(195, 430, 'REMOVE', {
      fontSize: '18px', color: hexToString(COLORS.text), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    const rmDesc = this.add.text(195, 452, 'Remove one card from your deck', {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.contentContainer.add([removeBtn, rmLabel, rmDesc]);

    removeBtn.onClick(() => this.renderCardPicker('remove'));
  }

  private renderCardPicker(mode: 'upgrade' | 'remove' = 'upgrade'): void {
    this.clearContent();

    const title = mode === 'upgrade' ? 'TAP A CARD TO UPGRADE' : 'TAP A CARD TO REMOVE';
    const titleText = this.add.text(195, 160, title, {
      fontSize: '13px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.contentContainer.add(titleText);

    const deck = this.run.getState().deck;
    const cardW = 70;
    const cardH = 95;
    const cols = 4;
    const gapX = 8;
    const gapY = 10;
    const startX = 55;
    const startY = 200;

    deck.forEach((card, i) => {
      const canSelect = mode === 'upgrade' ? !card.upgraded : (card.id !== 'strike' && card.id !== 'defend');
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      const container = this.createMiniCard(card, x, y, !canSelect);
      this.contentContainer.add(container);

      if (canSelect) {
        container.setSize(cardW, cardH);
        container.setInteractive({ useHandCursor: true });
        container.on('pointerdown', () => container.setScale(0.95));
        container.on('pointerup', () => {
          container.setScale(1);
          if (mode === 'upgrade') {
            this.renderUpgradePreview(i);
          } else {
            this.run.removeCardFromDeck(i);
            this.returnToMap();
          }
        });
        container.on('pointerout', () => container.setScale(1));
      }
    });

    // Back button
    const backBtn = new Button(this, 195, 770, 140, 40, 'BACK', COLORS.surfaceLight);
    backBtn.onClick(() => this.renderChoice());
    this.contentContainer.add(backBtn);
  }

  private renderUpgradePreview(index: number): void {
    this.clearContent();

    const deck = this.run.getState().deck;
    const original = deck[index];
    const upgraded = upgradeCard(original);

    this.add.text(195, 160, 'UPGRADE PREVIEW', {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Before card
    this.add.text(110, 200, 'BEFORE', {
      fontSize: '11px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);
    const beforeCard = this.createDetailCard(original, 110, 340);
    this.contentContainer.add(beforeCard);

    // Arrow
    this.add.text(195, 340, '→', {
      fontSize: '24px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // After card
    this.add.text(280, 200, 'AFTER', {
      fontSize: '11px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);
    const afterCard = this.createDetailCard(upgraded, 280, 340);
    this.contentContainer.add(afterCard);

    // Confirm
    const confirmBtn = new Button(this, 195, 550, 180, 48, 'CONFIRM', COLORS.accent);
    confirmBtn.onClick(() => {
      this.run.upgradeCardInDeck(index);
      this.returnToMap();
    });
    this.contentContainer.add(confirmBtn);

    // Back
    const backBtn = new Button(this, 195, 610, 140, 36, 'BACK', COLORS.surfaceLight);
    backBtn.onClick(() => this.renderCardPicker());
    this.contentContainer.add(backBtn);
  }

  private createMiniCard(card: Card, x: number, y: number, dimmed: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const w = 66;
    const h = 90;
    const alpha = dimmed ? 0.35 : 1;
    const rarityColor = RARITY_CONFIG[card.rarity].color;
    const oreColor = card.oreType === 'colorless' ? COLORS.textMuted : ORE_CONFIG[card.oreType as keyof typeof ORE_CONFIG].color;

    const bg = this.add.graphics();
    bg.fillStyle(COLORS.surface, alpha);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 5);
    bg.lineStyle(card.upgraded ? 3 : 2, card.upgraded ? COLORS.gold : rarityColor, alpha);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 5);
    container.add(bg);

    const costBg = this.add.circle(-w / 2 + 10, -h / 2 + 10, 8, COLORS.background, alpha);
    const cost = this.add.text(-w / 2 + 10, -h / 2 + 10, `${card.cost}`, {
      fontSize: '10px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(alpha);
    container.add([costBg, cost]);

    const bar = this.add.rectangle(0, -h / 2 + 4, w - 20, 3, oreColor, alpha);
    container.add(bar);

    const name = this.add.text(0, -5, card.name, {
      fontSize: '8px', color: hexToString(COLORS.text), fontFamily: 'monospace',
      wordWrap: { width: w - 6 }, align: 'center',
    }).setOrigin(0.5).setAlpha(alpha);
    container.add(name);

    const type = this.add.text(0, 12, card.type, {
      fontSize: '7px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5).setAlpha(alpha);
    container.add(type);

    if (card.upgraded) {
      const badge = this.add.text(w / 2 - 5, -h / 2 + 5, '★', {
        fontSize: '10px', color: hexToString(COLORS.gold),
      }).setOrigin(0.5).setAlpha(alpha);
      container.add(badge);
    }

    return container;
  }

  private createDetailCard(card: Card, x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const w = 130;
    const h = 200;
    const rarityColor = RARITY_CONFIG[card.rarity].color;
    const oreColor = card.oreType === 'colorless' ? COLORS.textMuted : ORE_CONFIG[card.oreType as keyof typeof ORE_CONFIG].color;

    const bg = this.add.graphics();
    bg.fillStyle(COLORS.surface, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(card.upgraded ? 3 : 2, card.upgraded ? COLORS.gold : rarityColor, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    container.add(bg);

    // Cost
    const costBg = this.add.circle(-w / 2 + 16, -h / 2 + 16, 12, COLORS.background);
    const cost = this.add.text(-w / 2 + 16, -h / 2 + 16, `${card.cost}`, {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add([costBg, cost]);

    // Ore bar
    const bar = this.add.rectangle(0, -h / 2 + 6, w - 32, 4, oreColor);
    container.add(bar);

    // Name
    const name = this.add.text(0, -50, card.name, {
      fontSize: '12px', color: hexToString(card.upgraded ? COLORS.gold : COLORS.text),
      fontFamily: 'monospace', fontStyle: 'bold', wordWrap: { width: w - 12 }, align: 'center',
    }).setOrigin(0.5);
    container.add(name);

    // Type
    const typeLabel = this.add.text(0, -30, `${RARITY_CONFIG[card.rarity].label} ${card.type}`, {
      fontSize: '9px', color: hexToString(rarityColor), fontFamily: 'monospace',
    }).setOrigin(0.5);
    container.add(typeLabel);

    // Description
    const desc = this.add.text(0, 10, card.description, {
      fontSize: '9px', color: hexToString(COLORS.text), fontFamily: 'monospace',
      wordWrap: { width: w - 16 }, align: 'center', lineSpacing: 3,
    }).setOrigin(0.5);
    container.add(desc);

    // Keywords
    if (card.keywords.length > 0) {
      const kw = this.add.text(0, h / 2 - 15, card.keywords.join(' '), {
        fontSize: '8px', color: hexToString(0xff6b35), fontFamily: 'monospace', fontStyle: 'italic',
      }).setOrigin(0.5);
      container.add(kw);
    }

    return container;
  }

  private returnToMap(): void {
    this.scene.stop('RestScene');
    this.scene.launch('Map');
  }
}
