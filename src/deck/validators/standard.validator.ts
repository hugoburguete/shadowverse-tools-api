import { CardType } from 'src/card/entities/card.entity';
import {
  DeckFormatValidator,
  IDeckFormatValidator,
  ValidatableCard,
} from './validator.interface';

/**
 * Validator for the standard format of Shadowverse evolve.
 */
export class StandardValidator
  extends DeckFormatValidator
  implements IDeckFormatValidator
{
  constructor(private cards: ValidatableCard[]) {
    super();
  }

  validate(): boolean {
    let deckClass: string;
    const evolveDeck = this.cards.filter(
      (card) => card.type === CardType.FOLLOWER_EVOLVE,
    );

    const leaderCards = this.cards.filter(
      (card) => card.type === CardType.LEADER,
    );
    if (leaderCards.length > 1) {
      this.addError('Your main deck size should contain 40 to 50 cards.');
      return false;
    }
    const leaderCard = leaderCards[0];
    const mainDeck = this.cards.filter(
      (card) =>
        card.type !== CardType.LEADER && card.type !== CardType.FOLLOWER_EVOLVE,
    );

    // Check card quantities
    if (!leaderCard) {
      this.addError('Your deck should have 1 leader card');
    } else {
      deckClass = leaderCard.class.slug;
    }

    const mainDeckQuantity = mainDeck.reduce<number>((prev, curr) => {
      return (prev += curr.quantity);
    }, 0);

    if (mainDeckQuantity < 40 || mainDeckQuantity > 50) {
      this.addError('Your main deck size should contain 40 to 50 cards.');
    }

    const evolveDeckQuantity = evolveDeck.reduce<number>((prev, curr) => {
      return (prev += curr.quantity);
    }, 0);

    if (evolveDeckQuantity > 10) {
      this.addError('Your evolve deck should not contain more than 10 cards');
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.quantity > 3) {
        this.addError(
          'You can only have a maximum of 3 copies of each card in your deck.',
        );
      }
    }

    if (leaderCard?.quantity > 1) {
      this.addError(
        'You can only have a maximum of 1 leader card in your deck.',
      );
    }

    // Check ban restrictions
    this.validateBans();

    // Check all cards belong to the same class
    if (deckClass) {
      const validClass = this.cards.every(
        (card) =>
          card.class.slug === 'neutral' || card.class.slug === deckClass,
      );
      if (!validClass) {
        this.addError(
          `Your deck can only contain cards of class ${deckClass} or neutral.`,
        );
      }
    }

    return !this.getErrors().length;
  }

  /**
   * Checks the current ban restrictions applied to the format.
   */
  validateBans() {
    const cardsRestrictedByOne = ['BP01-086EN', 'CP01-069EN', 'CP01-021EN'];

    for (let i = 0; i < cardsRestrictedByOne.length; i++) {
      const cardId = cardsRestrictedByOne[i];
      if (this.cards.find((card) => card.cardId === cardId)) {
        this.addError(`Card ${cardId} has been restricted to 1 copy`);
        break;
      }
    }
  }
}
