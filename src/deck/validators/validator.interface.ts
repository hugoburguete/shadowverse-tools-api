import { CardType } from 'src/card/entities/card.entity';
import { Class } from 'src/class/entities/class.entity';

export type ValidatableCard = {
  cardId: string;
  type: `${CardType}`;
  quantity: number;
  class: Class;
};

/**
 * Base class for a deck format validator.
 */
export abstract class DeckFormatValidator {
  /** Array of validation errors */
  errors: string[] = [];

  getErrors(): string[] {
    return this.errors;
  }

  addError(err: string): void {
    this.errors.push(err);
  }
}

/**
 * Contract for a deck format validator.
 */
export interface IDeckFormatValidator {
  /**
   * Checks the deck passes all the requirements for the format it's made for.
   */
  validate(): boolean;

  /**
   * Retrieves all the issues with this deck for the selected format.
   */
  getErrors(): string[];

  /**
   * Adds an error to the bag of errors in the validation process.
   */
  addError(err: string): void;
}
