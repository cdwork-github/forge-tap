export type PreconditionType = 'min_gold' | 'min_hp' | 'max_hp_pct' | 'has_relic' | 'min_deck_size' | 'min_act';

export interface EventPrecondition {
  type: PreconditionType;
  value: number | string;
}

export type OutcomeType = 'gain_card' | 'remove_card' | 'upgrade_card' | 'gain_gold' | 'lose_gold' | 'heal' | 'take_damage' | 'gain_relic' | 'lose_relic' | 'apply_status' | 'transform_cards' | 'combine_cards';

export interface EventOutcome {
  type: OutcomeType;
  value?: number;
  cardRarity?: string;
  relicId?: string;
  statusId?: string;
  description: string;
}

export interface EventChoice {
  label: string;
  outcomes: EventOutcome[];
  cost?: { type: 'gold' | 'hp' | 'card'; amount: number };
}

export interface EventPage {
  text: string;
  choices: EventChoice[];
}

export interface GameEvent {
  id: string;
  name: string;
  preconditions: EventPrecondition[];
  pages: EventPage[];
}

export const EVENTS: GameEvent[] = [
  {
    id: 'wandering_smith', name: 'Wandering Smith', preconditions: [],
    pages: [{
      text: 'A grizzled smith sits by a portable forge. "I can improve one of your materials, or strip one down for parts."',
      choices: [
        { label: 'Upgrade a card', outcomes: [{ type: 'upgrade_card', description: 'Upgrade 1 card in your deck.' }] },
        { label: 'Remove a card', outcomes: [{ type: 'remove_card', description: 'Remove 1 card from your deck.' }] },
        { label: 'Leave', outcomes: [] },
      ],
    }],
  },
  {
    id: 'mysterious_chest', name: 'Mysterious Chest', preconditions: [],
    pages: [{
      text: 'A glowing chest pulses with energy. It radiates heat — opening it may cost you.',
      choices: [
        { label: 'Open it', outcomes: [
          { type: 'gain_card', cardRarity: 'rare', description: 'Gain a random Rare card.' },
          { type: 'take_damage', value: 10, description: 'Take 10 damage.' },
        ]},
        { label: 'Leave it', outcomes: [] },
      ],
    }],
  },
  {
    id: 'rich_ore_vein', name: 'Rich Ore Vein', preconditions: [],
    pages: [{
      text: 'A shimmering vein of ore, richer than anything you\'ve seen. The forge energy here is amplified.',
      choices: [
        { label: 'Forge with boosted odds', outcomes: [
          { type: 'gain_card', description: 'Forge with +15% rarity boost. Pick 1 of 3 cards.' },
        ]},
      ],
    }],
  },
  {
    id: 'merchants_rest', name: 'Merchant\'s Rest', preconditions: [],
    pages: [{
      text: 'A friendly merchant offers a choice of aid before you continue deeper.',
      choices: [
        { label: 'Rest (Heal 20 HP)', outcomes: [{ type: 'heal', value: 20, description: 'Heal 20 HP.' }] },
        { label: 'Payment (Gain 30 gold)', outcomes: [{ type: 'gain_gold', value: 30, description: 'Gain 30 gold.' }] },
        { label: 'Lighten the load (Remove a card)', outcomes: [{ type: 'remove_card', description: 'Remove 1 card for free.' }] },
      ],
    }],
  },
  {
    id: 'cursed_shrine', name: 'Cursed Shrine', preconditions: [],
    pages: [{
      text: 'A dark shrine hums with forbidden power. Great reward awaits, but at a cost...',
      choices: [
        { label: 'Accept the power', outcomes: [
          { type: 'gain_card', cardRarity: 'epic', description: 'Gain a random Epic card.' },
          { type: 'gain_card', cardRarity: 'curse', description: 'Add a Curse to your deck.' },
        ]},
        { label: 'Take the gold instead', outcomes: [{ type: 'gain_gold', value: 25, description: 'Gain 25 gold.' }] },
      ],
    }],
  },
  {
    id: 'the_gambler', name: 'The Gambler', preconditions: [{ type: 'min_gold', value: 20 }],
    pages: [{
      text: '"Feeling lucky? Put up 20 gold and I\'ll flip a coin. Heads, you double it. Tails, you lose everything."',
      choices: [
        { label: 'Gamble 20 gold', outcomes: [
          { type: 'gain_gold', value: 40, description: '50% chance: Win 40 gold.' },
          { type: 'lose_gold', value: 999, description: '50% chance: Lose all gold.' },
        ], cost: { type: 'gold', amount: 20 } },
        { label: 'Walk away', outcomes: [] },
      ],
    }],
  },
  {
    id: 'element_shift', name: 'Element Shift', preconditions: [],
    pages: [{
      text: 'A swirling portal offers to transform the essence of your materials into a different element.',
      choices: [
        { label: 'Shift to Fire', outcomes: [{ type: 'transform_cards', description: 'Transform all non-Fire element cards to Fire equivalents.' }] },
        { label: 'Shift to Water', outcomes: [{ type: 'transform_cards', description: 'Transform all non-Water element cards to Water equivalents.' }] },
        { label: 'Shift to Earth', outcomes: [{ type: 'transform_cards', description: 'Transform all non-Earth element cards to Earth equivalents.' }] },
        { label: 'Shift to Void', outcomes: [{ type: 'transform_cards', description: 'Transform all non-Void element cards to Void equivalents.' }] },
      ],
    }],
  },
  {
    id: 'ancient_forge', name: 'Ancient Forge', preconditions: [{ type: 'min_deck_size', value: 8 }],
    pages: [{
      text: 'An ancient forge of immense power. It can fuse two materials into something greater, consuming both.',
      choices: [
        { label: 'Combine 2 cards', outcomes: [{ type: 'combine_cards', description: 'Select 2 cards to remove. Gain 1 upgraded hybrid card.' }] },
        { label: 'Leave', outcomes: [] },
      ],
    }],
  },
  {
    id: 'void_rift', name: 'Void Rift', preconditions: [{ type: 'min_act', value: 3 }],
    pages: [{
      text: 'A tear in reality pulses before you. Void energy seeps through. You could reach in, but it won\'t be painless.',
      choices: [
        { label: 'Reach in', outcomes: [
          { type: 'gain_card', cardRarity: 'epic', description: 'Gain a Void Epic card.' },
          { type: 'take_damage', value: 15, description: 'Take 15 damage.' },
          { type: 'apply_status', statusId: 'weakness', value: 3, description: 'Gain 3 Weakness.' },
        ]},
        { label: 'Seal it', outcomes: [{ type: 'heal', value: 10, description: 'Heal 10 HP.' }] },
      ],
    }],
  },
  {
    id: 'the_collector', name: 'The Collector', preconditions: [{ type: 'has_relic', value: 'any_3' }],
    pages: [{
      text: '"Ah, quite the collection you have. I\'ll trade you two rare cards for one of those relics. What do you say?"',
      choices: [
        { label: 'Trade a relic', outcomes: [
          { type: 'lose_relic', description: 'Lose 1 relic of your choice.' },
          { type: 'gain_card', cardRarity: 'rare', description: 'Gain 2 random Rare cards.' },
        ]},
        { label: 'Decline', outcomes: [] },
      ],
    }],
  },
];

export const EVENT_BY_ID = new Map(EVENTS.map((e) => [e.id, e]));
