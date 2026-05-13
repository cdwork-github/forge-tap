import Phaser from 'phaser';
import { RunStore } from '@/state/RunStore';
import { EVENTS, GameEvent, EventChoice } from '@/data/events';
import { ALL_CARDS } from '@/data/cards';
import { Button } from '@/ui/Button';
import { COLORS, hexToString } from '@/utils/colors';
import { getWeightedRarity, pickRandom } from '@/utils/random';
import { Rarity } from '@/models/types';

export class EventScene extends Phaser.Scene {
  private run!: RunStore;
  private event!: GameEvent;

  constructor() {
    super({ key: 'Event' });
  }

  create(): void {
    this.run = RunStore.getInstance();
    this.event = this.pickEvent();

    this.add.rectangle(195, 422, 390, 844, COLORS.background);

    this.renderPage(0);
  }

  private renderPage(pageIndex: number): void {
    // Clear previous content except background
    this.children.list
      .filter((c) => c !== this.children.list[0])
      .forEach((c) => c.destroy());

    const page = this.event.pages[pageIndex];
    if (!page) {
      this.returnToMap();
      return;
    }

    // Event name
    this.add.text(195, 50, this.event.name, {
      fontSize: '20px', color: hexToString(COLORS.gold), fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Event icon
    this.add.text(195, 100, '❓', { fontSize: '48px' }).setOrigin(0.5);

    // Event text
    this.add.text(195, 170, page.text, {
      fontSize: '13px', color: hexToString(COLORS.text), fontFamily: 'monospace',
      wordWrap: { width: 340 }, align: 'center', lineSpacing: 6,
    }).setOrigin(0.5, 0);

    // Choices
    const startY = 380;
    page.choices.forEach((choice, i) => {
      const y = startY + i * 70;
      const costText = choice.cost ? ` (${choice.cost.amount} ${choice.cost.type})` : '';
      const canAfford = this.canAffordChoice(choice);
      const color = canAfford ? COLORS.surfaceLight : 0x333333;

      const btn = new Button(this, 195, y, 320, 52, '', color);

      // Choice text (rendered separately for wrapping)
      this.add.text(195, y - 8, choice.label + costText, {
        fontSize: '12px', color: canAfford ? hexToString(COLORS.text) : hexToString(COLORS.textMuted),
        fontFamily: 'monospace', wordWrap: { width: 290 }, align: 'center',
      }).setOrigin(0.5);

      // Outcome preview
      const outcomes = choice.outcomes.map((o) => o.description).join('. ');
      if (outcomes) {
        this.add.text(195, y + 12, outcomes, {
          fontSize: '9px', color: hexToString(COLORS.textMuted),
          fontFamily: 'monospace', wordWrap: { width: 290 }, align: 'center',
        }).setOrigin(0.5);
      }

      if (canAfford) {
        btn.onClick(() => this.resolveChoice(choice, pageIndex));
      }
    });
  }

  private resolveChoice(choice: EventChoice, _pageIndex: number): void {
    // Pay costs
    if (choice.cost) {
      switch (choice.cost.type) {
        case 'gold':
          this.run.spendGold(choice.cost.amount);
          break;
        case 'hp':
          this.run.takeDamage(choice.cost.amount);
          break;
      }
    }

    // Apply outcomes
    for (const outcome of choice.outcomes) {
      switch (outcome.type) {
        case 'heal':
          if (outcome.value) this.run.heal(outcome.value);
          break;
        case 'take_damage':
          if (outcome.value) this.run.takeDamage(outcome.value);
          break;
        case 'gain_gold':
          if (outcome.value) this.run.addGold(outcome.value);
          break;
        case 'lose_gold':
          if (outcome.value) {
            const amount = outcome.value >= 999 ? this.run.getState().gold : outcome.value;
            this.run.spendGold(amount);
          }
          break;
        case 'gain_card': {
          const rarity = outcome.cardRarity === 'curse' ? null
            : outcome.cardRarity === 'epic' ? Rarity.Epic
            : outcome.cardRarity === 'rare' ? Rarity.Rare
            : getWeightedRarity();

          if (outcome.cardRarity === 'curse') {
            const curse = ALL_CARDS.find((c) => c.id === 'cl_curse');
            if (curse) this.run.addCardToDeck({ ...curse });
          } else if (rarity) {
            const pool = ALL_CARDS.filter((c) =>
              c.rarity === rarity && c.id !== 'strike' && c.id !== 'defend' && c.id !== 'cl_curse',
            );
            if (pool.length > 0) this.run.addCardToDeck({ ...pickRandom(pool) });
          }
          break;
        }
        case 'remove_card':
          // Remove a random non-starter card
          this.removeRandomCard();
          break;
        case 'upgrade_card':
          this.upgradeRandomCard();
          break;
      }
    }

    // Check if player died from damage
    if (this.run.getState().hp <= 0) return;

    this.showOutcomeAndReturn(choice);
  }

  private showOutcomeAndReturn(choice: EventChoice): void {
    this.children.list
      .filter((c) => c !== this.children.list[0])
      .forEach((c) => c.destroy());

    this.add.text(195, 300, 'Done!', {
      fontSize: '20px', color: hexToString(COLORS.text), fontFamily: 'monospace',
    }).setOrigin(0.5);

    const summary = choice.outcomes.map((o) => o.description).join('\n');
    this.add.text(195, 350, summary, {
      fontSize: '12px', color: hexToString(COLORS.textMuted), fontFamily: 'monospace',
      wordWrap: { width: 340 }, align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0);

    new Button(this, 195, 500, 160, 44, 'CONTINUE', COLORS.accent)
      .onClick(() => this.returnToMap());
  }

  private pickEvent(): GameEvent {
    const runState = this.run.getState();
    const eligible = EVENTS.filter((e) => this.checkPreconditions(e, runState));
    return eligible.length > 0 ? pickRandom(eligible) : EVENTS[0];
  }

  private checkPreconditions(event: GameEvent, runState: ReturnType<RunStore['getState']>): boolean {
    for (const pre of event.preconditions) {
      switch (pre.type) {
        case 'min_gold':
          if (runState.gold < (pre.value as number)) return false;
          break;
        case 'min_hp':
          if (runState.hp < (pre.value as number)) return false;
          break;
        case 'min_deck_size':
          if (runState.deck.length < (pre.value as number)) return false;
          break;
        case 'min_act':
          // Use current floor as proxy for act progression
          if (runState.currentFloor < (pre.value as number)) return false;
          break;
        case 'has_relic':
          if (pre.value === 'any_3' && runState.relicIds.length < 3) return false;
          break;
      }
    }
    return true;
  }

  private canAffordChoice(choice: EventChoice): boolean {
    if (!choice.cost) return true;
    const state = this.run.getState();
    switch (choice.cost.type) {
      case 'gold': return state.gold >= choice.cost.amount;
      case 'hp': return state.hp > choice.cost.amount;
      default: return true;
    }
  }

  private removeRandomCard(): void {
    const deck = this.run.getState().deck;
    const removable = deck
      .map((c, i) => ({ card: c, index: i }))
      .filter(({ card }) => card.id !== 'strike' && card.id !== 'defend');
    if (removable.length > 0) {
      const pick = pickRandom(removable);
      this.run.removeCardFromDeck(pick.index);
    }
  }

  private upgradeRandomCard(): void {
    const deck = this.run.getState().deck;
    const upgradable = deck
      .map((c, i) => ({ card: c, index: i }))
      .filter(({ card }) => !card.upgraded);
    if (upgradable.length > 0) {
      const pick = pickRandom(upgradable);
      this.run.upgradeCardInDeck(pick.index);
    }
  }

  private returnToMap(): void {
    this.scene.stop('Event');
    this.scene.launch('Map');
  }
}
