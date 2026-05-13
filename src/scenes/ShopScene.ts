import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { Card } from '@/models/Card';
import { ALL_CARDS } from '@/data/cards';
import { ITEMS } from '@/data/recipes';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { ORE_CONFIG } from '@/data/oreConfig';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';
import { Rarity } from '@/models/types';
import { pickRandom } from '@/utils/random';

interface ShopItem {
  type: 'card' | 'relic' | 'remove' | 'heal';
  card?: Card;
  relicId?: string;
  relicName?: string;
  price: number;
}

export class ShopScene extends Phaser.Scene {
  private run!: RunStore;
  private items: ShopItem[] = [];
  private goldText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'Shop' });
  }

  create(): void {
    this.run = RunStore.getInstance();
    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    this.add.text(195, 40, 'SHOP', {
      fontSize: '24px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.goldText = this.add.text(195, 70, '', {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.generateShopItems();
    this.renderItems();
    this.refreshGold();

    // Leave button
    new Button(this, 195, 780, 160, 44, 'LEAVE', COLORS.surfaceLight)
      .onClick(() => {
        this.scene.stop('Shop');
        this.scene.launch('Map');
      });
  }

  private generateShopItems(): void {
    const runState = this.run.getState();
    this.items = [];

    // 3 cards (common, uncommon, rare)
    for (const rarity of [Rarity.Common, Rarity.Uncommon, Rarity.Rare]) {
      const pool = ALL_CARDS.filter((c) =>
        c.rarity === rarity && c.id !== 'strike' && c.id !== 'defend' && c.id !== 'cl_curse',
      );
      if (pool.length > 0) {
        const price = rarity === Rarity.Common ? 45 : rarity === Rarity.Uncommon ? 65 : 110;
        this.items.push({ type: 'card', card: { ...pickRandom(pool) }, price });
      }
    }

    // 1 relic (if available)
    const unownedRelics = ITEMS.filter((item) => !runState.relicIds.includes(item.id));
    if (unownedRelics.length > 0) {
      const relic = pickRandom(unownedRelics);
      const price = relic.rarity === Rarity.Common ? 100
        : relic.rarity === Rarity.Uncommon ? 150
        : relic.rarity === Rarity.Rare ? 200
        : 250;
      this.items.push({ type: 'relic', relicId: relic.id, relicName: relic.name, price });
    }

    // Card removal
    this.items.push({ type: 'remove', price: 50 });

    // Heal potion
    this.items.push({ type: 'heal', price: 30 });
  }

  private renderItems(): void {
    const startY = 120;
    const rowH = 100;

    this.items.forEach((item, i) => {
      const y = startY + i * rowH;
      this.createShopRow(item, y, i);
    });
  }

  private createShopRow(item: ShopItem, y: number, index: number): void {
    const state = this.run.getState();
    const canAfford = state.gold >= item.price;
    const alpha = canAfford ? 1 : 0.4;

    // Background stripe
    if (index % 2 === 0) {
      this.add.rectangle(195, y, 370, 85, COLORS.surface, 0.3);
    }

    // Item info
    if (item.type === 'card' && item.card) {
      const card = item.card;
      const rarityColor = RARITY_CONFIG[card.rarity].color;
      const oreColor = card.oreType === 'colorless' ? COLORS.textMuted : ORE_CONFIG[card.oreType as keyof typeof ORE_CONFIG].color;

      // Mini card preview
      const swatch = this.add.rectangle(35, y - 10, 24, 24, oreColor).setAlpha(alpha);
      const costBadge = this.add.text(20, y - 25, `${card.cost}`, {
        fontSize: '11px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
        backgroundColor: '#000', padding: { x: 2, y: 1 },
      }).setAlpha(alpha);

      const name = this.add.text(65, y - 15, card.name, {
        fontSize: '12px', color: hexToString(rarityColor), fontFamily: 'monospace', fontStyle: 'bold',
      }).setAlpha(alpha);
      const desc = this.add.text(65, y + 5, card.description, {
        fontSize: '9px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
        wordWrap: { width: 200 },
      }).setAlpha(alpha);
      const typeLabel = this.add.text(65, y + 25, `${RARITY_CONFIG[card.rarity].label} ${card.type}`, {
        fontSize: '8px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setAlpha(alpha);

      void [swatch, costBadge, name, desc, typeLabel];
    } else if (item.type === 'relic') {
      this.add.text(35, y - 10, '🔮', { fontSize: '20px' }).setAlpha(alpha);
      this.add.text(65, y - 10, item.relicName ?? 'Relic', {
        fontSize: '12px', color: hexToString(COLORS.accent), fontFamily: 'monospace', fontStyle: 'bold',
      }).setAlpha(alpha);
      this.add.text(65, y + 10, 'Passive relic', {
        fontSize: '9px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setAlpha(alpha);
    } else if (item.type === 'remove') {
      this.add.text(35, y - 5, '🗑️', { fontSize: '20px' }).setAlpha(alpha);
      this.add.text(65, y - 5, 'Remove a card', {
        fontSize: '12px', color: hexToString(COLORS.text), fontFamily: 'monospace',
      }).setAlpha(alpha);
    } else if (item.type === 'heal') {
      this.add.text(35, y - 5, '💚', { fontSize: '20px' }).setAlpha(alpha);
      this.add.text(65, y - 5, 'Heal 25 HP', {
        fontSize: '12px', color: hexToString(COLORS.energy), fontFamily: 'monospace',
      }).setAlpha(alpha);
    }

    // Price + buy button
    if (canAfford) {
      const btn = new Button(this, 340, y, 70, 32, `${item.price}g`, COLORS.gold);
      btn.onClick(() => this.buyItem(item, index));
    } else {
      this.add.text(340, y, `${item.price}g`, {
        fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setOrigin(0.5).setAlpha(0.4);
    }
  }

  private buyItem(item: ShopItem, _index: number): void {
    if (!this.run.spendGold(item.price)) return;

    switch (item.type) {
      case 'card':
        if (item.card) this.run.addCardToDeck(item.card);
        break;
      case 'relic':
        if (item.relicId) this.run.addRelic(item.relicId);
        break;
      case 'remove':
        this.showRemovalPicker();
        return;
      case 'heal':
        this.run.heal(25);
        break;
    }

    // Rebuild scene to refresh state
    this.scene.restart();
  }

  private refreshGold(): void {
    this.goldText.setText(`Gold: ${this.run.getState().gold}`);
  }

  private showRemovalPicker(): void {
    // Overlay for card picker
    const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.9).setDepth(100);

    const title = this.add.text(195, 60, 'TAP A CARD TO REMOVE', {
      fontSize: '14px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(101);

    const deck = this.run.getState().deck;
    const cardW = 70;
    const cardH = 50;
    const cols = 4;
    const gapX = 8;
    const gapY = 12;
    const startX = 55;
    const startY = 110;

    const pickerItems: Phaser.GameObjects.Container[] = [];

    deck.forEach((card, i) => {
      const canRemove = card.id !== 'strike' && card.id !== 'defend';
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      const container = this.add.container(x, y).setDepth(102);
      const alpha = canRemove ? 1 : 0.3;

      const bg = this.add.graphics();
      bg.fillStyle(COLORS.surface, alpha);
      bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 4);
      bg.lineStyle(1, RARITY_CONFIG[card.rarity].color, alpha);
      bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 4);
      container.add(bg);

      const name = this.add.text(0, -5, card.name, {
        fontSize: '9px', color: '#fff', fontFamily: 'monospace',
        wordWrap: { width: cardW - 6 }, align: 'center',
      }).setOrigin(0.5).setAlpha(alpha);
      container.add(name);

      const type = this.add.text(0, 12, card.type, {
        fontSize: '7px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      }).setOrigin(0.5).setAlpha(alpha);
      container.add(type);

      if (canRemove) {
        container.setSize(cardW, cardH);
        container.setInteractive({ useHandCursor: true });
        container.on('pointerup', () => {
          this.run.removeCardFromDeck(i);
          // Clean up picker
          overlay.destroy();
          title.destroy();
          pickerItems.forEach((p) => p.destroy());
          cancelBtn.destroy();
          this.scene.restart();
        });
      }

      pickerItems.push(container);
    });

    const cancelBtn = new Button(this, 195, 760, 140, 40, 'CANCEL', COLORS.surfaceLight);
    cancelBtn.setDepth(102);
    cancelBtn.onClick(() => {
      overlay.destroy();
      title.destroy();
      pickerItems.forEach((p) => p.destroy());
      cancelBtn.destroy();
    });
  }
}
