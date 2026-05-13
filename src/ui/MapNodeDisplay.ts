import Phaser from 'phaser';
import { MapNode, NodeType } from '@/models/MapNode';
import { COLORS } from '@/utils/colors';

const NODE_COLORS: Record<NodeType, number> = {
  combat: 0xe94560,
  elite: 0xff6b35,
  forge: 0xffd700,
  rest: 0x4caf50,
  shop: 0x2196f3,
  event: 0x9c27b0,
  boss: 0xff0000,
};

const NODE_ICONS: Record<NodeType, string> = {
  combat: '⚔️',
  elite: '💀',
  forge: '⚒️',
  rest: '🔥',
  shop: '🛒',
  event: '❓',
  boss: '👑',
};

const NODE_LABELS: Record<NodeType, string> = {
  combat: 'Fight',
  elite: 'Elite',
  forge: 'Forge',
  rest: 'Rest',
  shop: 'Shop',
  event: 'Event',
  boss: 'Boss',
};

const NODE_RADIUS = 24;

export class MapNodeDisplay extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Graphics;
  private icon: Phaser.GameObjects.Text;
  private node: MapNode;
  private onTap?: () => void;

  constructor(scene: Phaser.Scene, node: MapNode, available: boolean) {
    super(scene, node.x, node.y);
    this.node = node;

    const color = NODE_COLORS[node.type];
    const alpha = available ? 1 : node.visited ? 0.5 : 0.3;

    this.circle = scene.add.graphics();
    this.circle.fillStyle(color, alpha);
    this.circle.fillCircle(0, 0, NODE_RADIUS);

    if (available) {
      this.circle.lineStyle(2, 0xffffff, 1);
      this.circle.strokeCircle(0, 0, NODE_RADIUS);
    }
    if (node.visited) {
      this.circle.lineStyle(2, COLORS.textMuted, 0.5);
      this.circle.strokeCircle(0, 0, NODE_RADIUS);
    }

    this.add(this.circle);

    this.icon = scene.add.text(0, -2, NODE_ICONS[node.type], {
      fontSize: '18px',
    }).setOrigin(0.5);
    this.add(this.icon);

    // Type label below node
    const label = scene.add.text(0, NODE_RADIUS + 6, NODE_LABELS[node.type], {
      fontSize: '8px', color: available ? '#ffffff' : '#666666',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setAlpha(available ? 0.9 : 0.4);
    this.add(label);

    if (available) {
      this.setSize(NODE_RADIUS * 2 + 10, NODE_RADIUS * 2 + 10);
      this.setInteractive({ useHandCursor: true });
      this.on('pointerdown', () => {
        this.setScale(0.9);
      });
      this.on('pointerup', () => {
        this.setScale(1);
        this.onTap?.();
      });
      this.on('pointerout', () => this.setScale(1));

      // Pulse animation for available nodes
      scene.tweens.add({
        targets: this,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    scene.add.existing(this);
  }

  onClick(cb: () => void): this {
    this.onTap = cb;
    return this;
  }

  getNode(): MapNode {
    return this.node;
  }
}

export function drawConnections(
  scene: Phaser.Scene,
  nodes: MapNode[],
  currentNodeId: string | null,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();

  for (const node of nodes) {
    for (const connId of node.connections) {
      const target = nodes.find((n) => n.id === connId);
      if (!target) continue;

      const isActivePath = node.visited && (node.id === currentNodeId || target.visited);
      g.lineStyle(isActivePath ? 3 : 1, isActivePath ? 0xffffff : COLORS.textMuted, isActivePath ? 0.8 : 0.3);
      g.lineBetween(node.x, node.y, target.x, target.y);
    }
  }

  return g;
}
