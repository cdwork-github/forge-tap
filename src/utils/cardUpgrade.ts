import { Card } from '@/models/Card';

export function upgradeCard(card: Card): Card {
  if (card.upgraded) return card;

  const upgraded = { ...card, upgraded: true, name: card.name + '+' };
  upgraded.effects = card.effects.map((effect) => {
    const e = { ...effect };
    switch (e.type) {
      case 'damage':
      case 'aoe_damage':
        e.value = Math.ceil(e.value * 1.25);
        break;
      case 'block':
        e.value = Math.ceil(e.value * 1.25);
        break;
      case 'heal':
        e.value = Math.ceil(e.value * 1.25);
        break;
      case 'draw':
        e.value = e.value + 1;
        break;
      case 'apply_status':
        e.value = e.value + 1;
        break;
      case 'gain_energy':
        e.value = e.value + 1;
        break;
    }
    return e;
  });

  // Power cards: reduce cost by 1 (min 0) instead of buffing effects if cost > 1
  if (card.type === 'power' && card.cost > 1) {
    upgraded.cost = card.cost - 1;
    upgraded.effects = card.effects.map((e) => ({ ...e }));
  }

  upgraded.description = generateUpgradeDescription(upgraded);
  return upgraded;
}

function generateUpgradeDescription(card: Card): string {
  const parts: string[] = [];

  for (const effect of card.effects) {
    switch (effect.type) {
      case 'damage':
        parts.push(`Deal ${effect.value} damage.`);
        break;
      case 'aoe_damage':
        parts.push(`Deal ${effect.value} damage to ALL.`);
        break;
      case 'block':
        parts.push(`Gain ${effect.value} Block.`);
        break;
      case 'heal':
        parts.push(`Heal ${effect.value} HP.`);
        break;
      case 'draw':
        parts.push(`Draw ${effect.value}.`);
        break;
      case 'gain_energy':
        parts.push(`Gain ${effect.value} Energy.`);
        break;
      case 'apply_status':
        if (effect.statusId) {
          const name = effect.statusId.charAt(0).toUpperCase() + effect.statusId.slice(1);
          const target = effect.target === 'all_enemies' ? ' to ALL' : effect.target === 'self' ? '' : '';
          parts.push(`Apply ${effect.value} ${name}${target}.`);
        }
        break;
    }
  }

  if (card.keywords.length > 0) {
    parts.push(card.keywords.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join('. ') + '.');
  }

  return parts.join(' ');
}
