import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { Card } from '@/models/Card';
import { Rarity } from '@/models/types';
import { ALL_CARDS } from '@/data/cards';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { ORE_CONFIG } from '@/data/oreConfig';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';
import { getWeightedRarity, pickRandom } from '@/utils/random';
import { NodeType } from '@/models/MapNode';

interface RewardData {
  nodeType: NodeType;
  gold: number;
}

export class RewardScene extends Phaser.Scene {
  private run!: RunStore;

  constructor() {
    super({ key: 'Reward' });
  }

  init(data: RewardData): void {
    this.run = RunStore.getInstance();
    this.run.addGold(data.gold);
  }

  create(): void {
    const data = this.scene.settings.data as RewardData;
    this.add.rectangle(195, 422, 390, 844, 0x000000, 0.9);

    this.add.text(195, 60, 'REWARDS', {
      fontSize: '24px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 100, `+${data.gold} Gold`, {
      fontSize: '16px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(195, 140, 'Choose a card to add to your deck:', {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5);

    const choices = this.generateCardChoices(data.nodeType);
    const cardW = 100;
    const gap = 15;
    const totalW = choices.length * (cardW + gap) - gap;
    const startX = (390 - totalW) / 2 + cardW / 2;

    choices.forEach((card, i) => {
      const x = startX + i * (cardW + gap);
      this.createRewardCard(card, x, 340, i);
    });

    // Skip button
    new Button(this, 195, 620, 160, 40, 'SKIP', COLORS.surfaceLight)
      .onClick(() => this.returnToMap());
  }

  private createRewardCard(card: Card, x: number, y: number, _index: number): void {
    const container = this.add.container(x, y);
    const w = 95;
    const h = 150;
    const rarityColor = RARITY_CONFIG[card.rarity].color;
    const oreColor = card.oreType === 'colorless' ? COLORS.textMuted : ORE_CONFIG[card.oreType as keyof typeof ORE_CONFIG].color;

    // Card bg
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.surface, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(2, rarityColor, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    container.add(bg);

    // Cost
    const costCircle = this.add.circle(-w / 2 + 14, -h / 2 + 14, 12, COLORS.background);
    const costText = this.add.text(-w / 2 + 14, -h / 2 + 14, `${card.cost}`, {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add([costCircle, costText]);

    // Ore bar
    const oreBar = this.add.rectangle(0, -h / 2 + 6, w - 28, 4, oreColor);
    container.add(oreBar);

    // Name
    this.add.text(x, y - 30, card.name, {
      fontSize: '11px', color: hexToString(COLORS.text), fontFamily: 'monospace',
      wordWrap: { width: w - 10 }, align: 'center',
    }).setOrigin(0.5);

    // Type
    this.add.text(x, y - 10, card.type.toUpperCase(), {
      fontSize: '9px', color: hexToString(rarityColor), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Description
    this.add.text(x, y + 10, card.description, {
      fontSize: '8px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      wordWrap: { width: w - 10 }, align: 'center',
    }).setOrigin(0.5, 0);

    // Rarity label
    this.add.text(x, y + h / 2 - 15, RARITY_CONFIG[card.rarity].label, {
      fontSize: '8px', color: hexToString(rarityColor), fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Keywords
    if (card.keywords.length > 0) {
      this.add.text(x, y + h / 2 - 5, card.keywords.join(' '), {
        fontSize: '7px', color: hexToString(0xff6b35), fontFamily: 'monospace', fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    // Interactive
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', () => container.setScale(0.95));
    container.on('pointerup', () => {
      this.run.addCardToDeck(card);
      this.returnToMap();
    });
    container.on('pointerout', () => container.setScale(1));
  }

  private generateCardChoices(nodeType: NodeType): Card[] {
    const runState = this.run.getState();
    const affinity = runState.oreAffinity;

    // Elite/boss guarantee higher rarity
    const minRarity = nodeType === 'elite' ? Rarity.Rare
      : nodeType === 'boss' ? Rarity.Epic
      : Rarity.Common;

    const choices: Card[] = [];
    for (let i = 0; i < 3; i++) {
      let rarity = getWeightedRarity();
      const rarityOrder = [Rarity.Common, Rarity.Uncommon, Rarity.Rare, Rarity.Epic, Rarity.Legendary];
      if (rarityOrder.indexOf(rarity) < rarityOrder.indexOf(minRarity)) {
        rarity = minRarity;
      }

      // 75% affinity, 25% off-element or colorless
      const isAffinity = Math.random() < 0.75;
      const pool = ALL_CARDS.filter((c) => {
        if (c.id === 'strike' || c.id === 'defend' || c.id === 'cl_curse') return false;
        if (c.rarity !== rarity) return false;
        if (isAffinity) return c.oreType === affinity;
        return c.oreType !== affinity;
      });

      if (pool.length > 0) {
        choices.push({ ...pickRandom(pool) });
      }
    }

    // Fallback if we got less than 3
    while (choices.length < 3) {
      const fallback = ALL_CARDS.filter((c) =>
        c.oreType === affinity && c.rarity === Rarity.Common && c.id !== 'strike' && c.id !== 'defend',
      );
      if (fallback.length > 0) choices.push({ ...pickRandom(fallback) });
      else break;
    }

    return choices;
  }

  private returnToMap(): void {
    this.scene.stop('Reward');
    this.scene.launch('Map');
  }
}
