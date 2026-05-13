import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { MapNodeDisplay, drawConnections } from '@/ui/MapNodeDisplay';
import { COLORS, hexToString } from '@/utils/colors';

export class MapScene extends Phaser.Scene {
  private runStore!: RunStore;

  constructor() {
    super({ key: 'Map' });
  }

  create(): void {
    this.runStore = RunStore.getInstance();

    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    // Header
    const state = this.runStore.getState();
    this.add.text(195, 25, `Floor ${state.currentFloor}/10`, {
      fontSize: '18px', color: hexToString(COLORS.text), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stats bar
    this.add.text(20, 50, `HP: ${state.hp}/${state.maxHp}`, {
      fontSize: '12px', color: hexToString(state.hp < 20 ? COLORS.energyLow : COLORS.energy), fontFamily: 'monospace',
    });
    this.add.text(370, 50, `Gold: ${state.gold}`, {
      fontSize: '12px', color: hexToString(COLORS.gold), fontFamily: 'monospace',
    }).setOrigin(1, 0);
    this.add.text(195, 50, `Deck: ${state.deck.length}`, {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
    }).setOrigin(0.5, 0);

    // Draw connection lines first (behind nodes)
    drawConnections(this, state.map.nodes, state.map.currentNodeId);

    // Draw nodes
    const availableNodes = this.runStore.getAvailableNodes();
    const availableIds = new Set(availableNodes.map((n) => n.id));

    for (const node of state.map.nodes) {
      const isAvailable = availableIds.has(node.id);
      const display = new MapNodeDisplay(this, node, isAvailable);

      if (isAvailable) {
        display.onClick(() => {
          const selected = this.runStore.selectNode(node.id);
          if (!selected) return;

          this.scene.stop('Map');

          switch (selected.type) {
            case 'combat':
            case 'elite':
            case 'boss':
              this.scene.launch('Combat', {
                nodeType: selected.type,
                actId: state.actId,
              });
              break;
            case 'forge':
              // Simplified forge: heal a bit and add a random card
              this.runStore.heal(5);
              this.scene.launch('Reward', { nodeType: 'forge', gold: 0 });
              break;
            case 'rest':
              this.scene.launch('RestScene');
              break;
            case 'shop':
              this.scene.launch('Shop');
              break;
            case 'event':
              this.scene.launch('Event');
              break;
          }
        });
      }
    }
  }
}
