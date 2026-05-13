import Phaser from 'phaser';
import { GameStore } from '@/state/GameStore';
import { MATERIAL_BY_ID } from '@/data/materials';
import { RECIPES, ITEMS, ITEM_BY_ID } from '@/data/recipes';
import { MaterialCard } from '@/ui/MaterialCard';
import { Button } from '@/ui/Button';
import { RARITY_CONFIG } from '@/data/rarityConfig';
import { COLORS, hexToString } from '@/utils/colors';
import { Rarity } from '@/models/types';

type Tab = 'materials' | 'items' | 'recipes';

const RARITY_ORDER: Rarity[] = [Rarity.Legendary, Rarity.Epic, Rarity.Rare, Rarity.Uncommon, Rarity.Common];

export class InventoryScene extends Phaser.Scene {
  private store!: GameStore;
  private activeTab: Tab = 'materials';
  private contentContainer!: Phaser.GameObjects.Container;
  private tabButtons: Phaser.GameObjects.Text[] = [];
  private tabIndicator!: Phaser.GameObjects.Rectangle;
  private scrollY = 0;
  private isDragging = false;
  private dragStartY = 0;
  private contentHeight = 0;

  constructor() {
    super({ key: 'Inventory' });
  }

  create(): void {
    this.store = GameStore.getInstance();

    // Background
    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    // Header
    this.add.text(195, 40, 'INVENTORY', {
      fontSize: '24px',
      color: hexToString(COLORS.text),
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Back button
    new Button(this, 50, 40, 70, 32, 'BACK', COLORS.surfaceLight)
      .onClick(() => {
        this.scene.stop('Inventory');
        this.scene.wake('MainGame');
      });

    // Tabs
    this.createTabs();

    // Content area with scroll
    this.contentContainer = this.add.container(0, 0);

    // Mask to clip content to visible area (below tabs, above bottom)
    const maskShape = this.add.graphics();
    maskShape.fillRect(0, 105, 390, 680);
    const mask = maskShape.createGeometryMask();
    this.contentContainer.setMask(mask);

    // Scroll handling
    this.scrollY = 0;
    this.isDragging = false;
    this.setupScrolling();

    this.renderTab();
  }

  private createTabs(): void {
    const tabs: { label: string; key: Tab }[] = [
      { label: 'Materials', key: 'materials' },
      { label: 'Items', key: 'items' },
      { label: 'Recipes', key: 'recipes' },
    ];

    this.tabIndicator = this.add.rectangle(65, 95, 130, 3, COLORS.accent);

    tabs.forEach((tab, i) => {
      const x = 65 + i * 130;
      const text = this.add.text(x, 78, tab.label, {
        fontSize: '16px',
        color: this.activeTab === tab.key ? hexToString(COLORS.text) : hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      text.on('pointerdown', () => {
        this.activeTab = tab.key;
        this.tabButtons.forEach((t, j) => {
          t.setColor(j === i ? hexToString(COLORS.text) : hexToString(COLORS.textMuted));
        });
        this.tabIndicator.setX(65 + i * 130);
        this.renderTab();
      });

      this.tabButtons.push(text);
    });
  }

  private setupScrolling(): void {
    const viewTop = 105;
    const viewBottom = 785;
    const viewHeight = viewBottom - viewTop;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y >= viewTop && pointer.y <= viewBottom) {
        this.isDragging = true;
        this.dragStartY = pointer.y;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging) return;
      const dy = pointer.y - this.dragStartY;
      this.dragStartY = pointer.y;
      this.scrollY += dy;

      const maxScroll = 0;
      const minScroll = Math.min(0, -(this.contentHeight - viewHeight));
      this.scrollY = Phaser.Math.Clamp(this.scrollY, minScroll, maxScroll);
      this.contentContainer.setY(this.scrollY);
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });
  }

  private renderTab(): void {
    this.contentContainer.removeAll(true);
    this.scrollY = 0;
    this.contentContainer.setY(0);

    if (this.activeTab === 'materials') {
      this.renderMaterials();
    } else if (this.activeTab === 'items') {
      this.renderItems();
    } else {
      this.renderRecipes();
    }
  }

  private renderMaterials(): void {
    const state = this.store.getState();
    const entries = Object.entries(state.materials)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ material: MATERIAL_BY_ID.get(id)!, count }))
      .filter((e) => e.material)
      .sort((a, b) => {
        const ra = RARITY_ORDER.indexOf(a.material.rarity);
        const rb = RARITY_ORDER.indexOf(b.material.rarity);
        return ra - rb;
      });

    if (entries.length === 0) {
      const empty = this.add.text(195, 300, 'No materials yet.\nStart tapping to forge!', {
        fontSize: '14px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
        align: 'center',
      }).setOrigin(0.5);
      this.contentContainer.add(empty);
      return;
    }

    const cols = 4;
    const cardW = 85;
    const cardH = 100;
    const gapX = 8;
    const gapY = 10;
    const startX = 52;
    const startY = 160;

    entries.forEach((entry, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const card = new MaterialCard(this, x, y, entry.material, entry.count);
      this.contentContainer.add(card);
    });

    const totalRows = Math.ceil(entries.length / cols);
    this.contentHeight = startY + totalRows * (cardH + gapY) + 40;
  }

  private renderItems(): void {
    const state = this.store.getState();
    const entries = Object.entries(state.items)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ item: ITEM_BY_ID.get(id)!, count }))
      .filter((e) => e.item);

    if (entries.length === 0) {
      const empty = this.add.text(195, 300, 'No items crafted yet.\nCombine materials in Recipes!', {
        fontSize: '14px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
        align: 'center',
      }).setOrigin(0.5);
      this.contentContainer.add(empty);
      return;
    }

    const startY = 140;
    const rowH = 70;

    entries.forEach((entry, i) => {
      const y = startY + i * rowH;
      const rarityConfig = RARITY_CONFIG[entry.item.rarity];

      const row = this.add.container(0, y);

      // Item color swatch with rarity border
      const swatch = this.add.rectangle(40, 0, 40, 40, entry.item.color);
      const border = this.add.graphics();
      border.lineStyle(2, rarityConfig.color, 1);
      border.strokeRect(40 - 20, -20, 40, 40);
      row.add([swatch, border]);

      // Item name
      const name = this.add.text(75, -12, entry.item.name, {
        fontSize: '14px',
        color: hexToString(rarityConfig.color),
        fontFamily: 'monospace',
        fontStyle: 'bold',
      });
      row.add(name);

      // Rarity + count
      const info = this.add.text(75, 8, `${rarityConfig.label} x${entry.count}`, {
        fontSize: '11px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      });
      row.add(info);

      this.contentContainer.add(row);
    });

    this.contentHeight = startY + entries.length * rowH + 40;
  }

  private renderRecipes(): void {
    const state = this.store.getState();
    const startY = 130;
    const rowH = 80;

    if (RECIPES.length === 0) return;

    RECIPES.forEach((recipe, i) => {
      const y = startY + i * rowH;
      const matA = MATERIAL_BY_ID.get(recipe.materialIds[0]);
      const matB = MATERIAL_BY_ID.get(recipe.materialIds[1]);
      const item = ITEMS.find((it) => it.id === recipe.resultItemId);

      if (!matA || !matB || !item) return;

      const hasA = (state.materials[recipe.materialIds[0]] ?? 0) >= 1;
      const hasB = (state.materials[recipe.materialIds[1]] ?? 0) >= 1;
      const canCraft = hasA && hasB;
      const alpha = canCraft ? 1 : 0.4;

      const row = this.add.container(0, y);

      // Material A
      const colorA = hasA ? matA.color : 0x555555;
      const swatchA = this.add.rectangle(40, 0, 28, 28, colorA).setAlpha(alpha);
      const nameA = this.add.text(40, 20, matA.name, {
        fontSize: '8px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0.5, 0).setAlpha(alpha);
      row.add([swatchA, nameA]);

      // "+"
      const plus = this.add.text(80, 0, '+', {
        fontSize: '18px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0.5).setAlpha(alpha);
      row.add(plus);

      // Material B
      const colorB = hasB ? matB.color : 0x555555;
      const swatchB = this.add.rectangle(120, 0, 28, 28, colorB).setAlpha(alpha);
      const nameB = this.add.text(120, 20, matB.name, {
        fontSize: '8px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0.5, 0).setAlpha(alpha);
      row.add([swatchB, nameB]);

      // "="
      const eq = this.add.text(160, 0, '=', {
        fontSize: '18px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0.5).setAlpha(alpha);
      row.add(eq);

      // Result item
      const itemColor = canCraft ? item.color : 0x555555;
      const rarityColor = RARITY_CONFIG[item.rarity].color;
      const itemSwatch = this.add.rectangle(210, 0, 32, 32, itemColor).setAlpha(alpha);
      const itemBorder = this.add.graphics();
      itemBorder.lineStyle(2, canCraft ? rarityColor : 0x555555, alpha);
      itemBorder.strokeRect(210 - 16, -16, 32, 32);
      const itemName = this.add.text(260, -8, item.name, {
        fontSize: '11px',
        color: canCraft ? hexToString(rarityColor) : hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5).setAlpha(alpha);
      const itemRarity = this.add.text(260, 8, RARITY_CONFIG[item.rarity].label, {
        fontSize: '9px',
        color: hexToString(COLORS.textMuted),
        fontFamily: 'monospace',
      }).setOrigin(0, 0.5).setAlpha(alpha);
      row.add([itemSwatch, itemBorder, itemName, itemRarity]);

      // Craft button
      if (canCraft) {
        const craftBtn = new Button(this, 355, 0, 50, 28, 'CRAFT', COLORS.accent);
        craftBtn.onClick(() => {
          this.store.craftItem(recipe.id, recipe.materialIds);
          this.renderTab();
        });
        row.add(craftBtn);
      }

      this.contentContainer.add(row);
    });

    this.contentHeight = startY + RECIPES.length * rowH + 40;
  }
}
