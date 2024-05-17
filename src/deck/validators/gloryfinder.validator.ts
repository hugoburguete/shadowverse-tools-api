import { CardType } from 'src/card/entities/card.entity';
import {
  DeckFormatValidator,
  IDeckFormatValidator,
  ValidatableCard,
} from './validator.interface';

/**
 * Validator for the gloryfinder format of Shadowverse evolve.
 */
export class GloryfinderValidator
  extends DeckFormatValidator
  implements IDeckFormatValidator
{
  constructor(private cards: ValidatableCard[]) {
    super();
  }

  validate(): boolean {
    const evolveDeck = this.cards.filter(
      (card) => card.type === CardType.FOLLOWER_EVOLVE,
    );
    const leaderCard = this.cards.filter(
      (card) => card.type === CardType.LEADER,
    )[0];
    const mainDeck = this.cards.filter(
      (card) =>
        card.type !== CardType.LEADER && card.type !== CardType.FOLLOWER_EVOLVE,
    );

    // Check card quantities
    if (!leaderCard) {
      this.addError('Your deck should have 1 leader card');
    }

    if (mainDeck.length < 40 || mainDeck.length > 50) {
      this.addError('Your main deck size should contain 40 to 50 cards.');
    }

    if (evolveDeck.length > 10) {
      this.addError('Your evolve deck should not contain more than 10 cards');
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.quantity > 1) {
        this.addError(
          'You can only have a maximum of 1 copy of each card in your deck.',
        );
      }
    }

    if (leaderCard[0].quantity > 1) {
      this.addError(
        'You can only have a maximum of 1 leader card in your deck.',
      );
    }

    return !this.getErrors().length;
  }
}
