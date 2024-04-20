import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateDeckInput } from './dto/create-deck.input';
import { UpdateDeckInput } from './dto/update-deck.input';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck)
    private deckModel: typeof Deck,
    @InjectModel(DeckCard)
    private deckCardModel: typeof DeckCard,
  ) {}

  async create(createDeckInput: CreateDeckInput): Promise<Deck> {
    const { deckCards, ...rest } = createDeckInput;
    const newDeck = await this.deckModel.create(rest);
    deckCards.forEach(async (deckCard) => {
      deckCard.deckId = newDeck.id;
      console.log(deckCard);
      await this.deckCardModel.create({ ...deckCard });
    });

    return newDeck;
  }

  async findAll(userId: number): Promise<Deck[]> {
    return await this.deckModel.findAll({
      where: { userId },
    });
  }

  async findOne(id: number): Promise<Deck> {
    return await this.deckModel.findOne({
      where: { id: { [Op.eq]: id } },
    });
  }

  update(id: number, updateDeckInput: UpdateDeckInput) {
    console.log(updateDeckInput);
    return `This action updates a #${id} deck`;
  }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
