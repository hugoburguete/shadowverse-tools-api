import { UserInputError } from '@nestjs/apollo';
import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from '../../card/entities/card.entity';
import { Class } from '../../class/entities/class.entity';
import { CreateDeckInput } from '../dto/create-deck.input';
import { DeckFormat } from '../entities/deck.entity';
import { GloryfinderValidator } from '../validators/gloryfinder.validator';
import { StandardValidator } from '../validators/standard.validator';
import {
  IDeckFormatValidator,
  ValidatableCard,
} from '../validators/validator.interface';

@Injectable()
export class DeckValidationPipe
  implements PipeTransform<CreateDeckInput, Promise<CreateDeckInput>>
{
  constructor(
    @InjectModel(Card)
    private cardModel: typeof Card,
  ) {}

  async transform(deck: CreateDeckInput) {
    const { deckCards, format } = deck;
    let validator: IDeckFormatValidator;

    const cardData = await this.cardModel.findAll({
      where: {
        id: deckCards.map((card) => card.cardId),
      },
      attributes: ['id', 'cardId', 'type'],
      include: [
        {
          model: Class,
          attributes: ['slug'],
        },
      ],
    });

    const cards: ValidatableCard[] = cardData.map((card) => {
      return {
        ...card.toJSON(),
        quantity: deckCards.find((deckCard) => card.id === deckCard.cardId)
          .quantity,
      };
    }) as ValidatableCard[];

    switch (format) {
      case DeckFormat.STANDARD:
        validator = new StandardValidator(cards);
        break;
      case DeckFormat.GLORYFINDER:
        validator = new GloryfinderValidator(cards);
        break;

      default:
        this.sendValidationError('Invalid format.');
        break;
    }

    const isValid = validator.validate();
    if (!isValid) {
      this.sendValidationError(validator.getErrors().join(', '));
    }

    return deck;
  }

  private sendValidationError(err: string) {
    throw new UserInputError(err);
  }
}
