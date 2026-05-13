export const COLORS = {
  background: 0x1a1a2e,
  surface: 0x16213e,
  surfaceLight: 0x0f3460,
  cardBg: 0x1e2d50,
  text: 0xffffff,
  textMuted: 0x9e9e9e,
  accent: 0xe94560,
  energy: 0x4caf50,
  energyLow: 0xf44336,
  gold: 0xffd700,
} as const;

export const FONT = {
  body: 'Arial, Helvetica, sans-serif',
  mono: 'monospace',
} as const;

export function hexToString(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0');
}
