import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';
import { CursorService } from 'src/common/cursor.service';
import { ParsedField } from 'src/common/decorators/fields.decorator';
import { IEdgeType } from 'src/common/interfaces/paginated.interface';
import { CreateDeckInput } from './dto/create-deck.input';
import { UpdateDeckInput } from './dto/update-deck.input';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';
import { PaginatedDecks } from './entities/paginated-deck.entity';

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
      await this.deckCardModel.create({ ...deckCard });
    });

    return newDeck;
  }

  async findAll(
    userId: number,
    attributes: ParsedField,
  ): Promise<PaginatedDecks> {
    const cursorService = new CursorService();

    const include: Includeable[] = this.getAssociations(attributes);
    const where = { userId };

    const decks = await this.deckModel.findAll({
      where,
      include,
    });

    const totalCount = await this.deckModel.count({
      where,
      include,
    });

    const edges: IEdgeType<Deck>[] = decks.map((deck) => {
      const cursor = cursorService.generateCursor({
        entityId: deck.id,
      });
      return {
        node: deck,
        cursor: cursor,
      };
    });

    const startCursor = edges.length > 0 ? edges[0].cursor : null;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    const hasNextPage = decks.length < totalCount;

    return {
      totalCount,
      edges,
      pageInfo: { startCursor, endCursor, hasNextPage },
    };
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

  private getAssociations = (attributes: ParsedField): Includeable[] => {
    const include = [];
    const cardsAttr = attributes.relations.cards;
    if (cardsAttr) {
      include.push(this.getCardsAssociation(cardsAttr));
    }

    const deckCardsAttr = attributes.relations.cardsInfo;
    if (deckCardsAttr) {
      include.push(this.getDeckCardsAssociation(deckCardsAttr));
    }
    return include;
  };

  private getCardsAssociation(cardsAttr: ParsedField<string>): Includeable {
    return {
      model: Card,
      attributes: cardsAttr.fields,
    };
  }

  private getDeckCardsAssociation(
    deckCardsAttr: ParsedField<string>,
  ): Includeable {
    return {
      model: DeckCard,
      attributes: deckCardsAttr.fields,
    };
  }
}
