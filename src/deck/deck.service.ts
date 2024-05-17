import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize, WhereOptions } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';
import { Class } from 'src/class/entities/class.entity';
import { CursorService } from 'src/common/cursor.service';
import { ParsedField } from 'src/common/decorators/fields.decorator';
import { ResourceNotFoundError } from 'src/common/errors/resource-not-found.error';
import { IEdgeType } from 'src/common/interfaces/paginated.interface';
import { Rarity } from 'src/rarity/entities/rarity.entity';
import { CreateDeckInput } from './dto/create-deck.input';
import { FindAllDecksArgs } from './dto/find-all-decks.args';
import { FindOneDeckArgs } from './dto/find-one-deck.args';
import { RemoveDeckArgs } from './dto/remove-deck.args';
import { UpdateDeckArgs } from './dto/update-deck.args';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';
import { PaginatedDecks } from './entities/paginated-deck.entity';

@Injectable()
export class DeckService {
  private cursorService = new CursorService();

  constructor(
    @InjectModel(Deck)
    private deckModel: typeof Deck,
    @InjectModel(DeckCard)
    private deckCardModel: typeof DeckCard,
  ) {}

  /**
   * Creates a new deck.
   */
  async create(
    createDeckInput: CreateDeckInput,
    attributes: ParsedField,
  ): Promise<Deck> {
    const { deckCards, ...rest } = createDeckInput;
    const { id } = await this.deckModel.create(rest);

    const bulkDeckCardInfo = deckCards.map((deckCard) => {
      deckCard.deckId = id;
      return { ...deckCard };
    });
    await this.deckCardModel.bulkCreate(bulkDeckCardInfo);

    return this.findOne({ id, attributes });
  }

  /**
   * Retrieves all decks for a user.
   */
  async findAll({
    userId,
    attributes,
    after,
  }: FindAllDecksArgs): Promise<PaginatedDecks> {
    const include: Includeable[] = this.getAssociations(attributes);
    let afterCondition: WhereOptions;
    if (after) {
      const { entityId } = this.cursorService.decodeCursor(after);
      afterCondition = {
        id: {
          [Op.gt]: entityId,
        },
      };
    }
    const baseConditions = { userId };

    const decks = await this.deckModel.findAll({
      attributes: attributes.fields,
      where: Sequelize.and([baseConditions, after ? afterCondition : []]),
      include,
    });

    const totalCount = await this.deckModel.count({
      where: baseConditions,
      include,
    });

    const edges: IEdgeType<Deck>[] = decks.map((deck) => {
      const cursor = this.cursorService.generateCursor({
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

  /**
   * Retrieve a user deck.
   */
  async findOne({ id, attributes }: FindOneDeckArgs): Promise<Deck> {
    const include: Includeable[] = this.getAssociations(attributes);

    const deck = await this.deckModel.findOne({
      where: { id: { [Op.eq]: id } },
      attributes: attributes.fields,
      include,
    });

    if (!deck) {
      throw new ResourceNotFoundError(`Could not find deck with id ${id}.`);
    }

    return deck;
  }

  /**
   * Updates a user deck.
   */
  async update({ id, userId, input }: UpdateDeckArgs): Promise<boolean> {
    const deck = await this.findOne({
      id,
      attributes: {
        fields: ['id'],
        relations: {},
      },
    });

    if (deck) {
      const { deckCards, ...deckParams } = input;

      if (deckCards) {
        await this.deckCardModel.destroy({
          where: { deckId: id },
        });
        const bulkDeckCardInfo = deckCards.map((deckCard) => {
          deckCard.deckId = deck.id;
          return { ...deckCard };
        });
        await this.deckCardModel.bulkCreate(bulkDeckCardInfo);
      }

      const updateResult = await this.deckModel.update(deckParams, {
        where: { id, userId },
      });

      return updateResult.length > 0 && updateResult[0] > 0;
    }

    return false;
  }

  /**
   * Removes a user deck.
   */
  async remove({ id, userId }: RemoveDeckArgs): Promise<boolean> {
    const deck = await this.findOne({
      id,
      attributes: {
        fields: ['id'],
        relations: {},
      },
    });

    if (deck) {
      await this.deckCardModel.destroy({
        where: { id },
      });

      const decksDeleted = await this.deckModel.destroy({
        where: { id, userId },
      });

      return decksDeleted > 0;
    }

    return false;
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
    const include = [];
    const classAttr = cardsAttr.relations.class;
    if (classAttr) {
      include.push(this.getClassAssociation(classAttr));
    }

    const rarityAttr = cardsAttr.relations.rarity;
    if (rarityAttr) {
      include.push(this.getRarityAssociation(rarityAttr));
    }

    return {
      model: Card,
      attributes: cardsAttr.fields,
      include,
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

  private getClassAssociation(classAttr: ParsedField<string>): Includeable {
    return {
      model: Class,
      attributes: classAttr.fields,
    };
  }

  private getRarityAssociation(classAttr: ParsedField<string>): Includeable {
    return {
      model: Rarity,
      attributes: classAttr.fields,
    };
  }
}
