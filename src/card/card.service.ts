import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize, WhereOptions } from 'sequelize';
import { Class } from '../class/entities/class.entity';
import { CursorService } from '../common/cursor.service';
import { ParsedField } from '../common/decorators/fields.decorator';
import { IEdgeType } from '../common/interfaces/paginated.interface';
import { Expansion } from '../expansion/entities/expansion.entity';
import { Rarity } from '../rarity/entities/rarity.entity';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { FindByIdArgs } from './dto/find-by-id.args';
import { Card } from './entities/card.entity';
import { PaginatedCards } from './entities/paginated-card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card)
    private cardModel: typeof Card,
  ) {}

  /**
   * Searches for cards.
   *
   * @param searchCriteria Search options
   * @returns the card results that match the search criteria
   */
  findAll = async (
    searchCriteria: FindAllCardsArgs = new FindAllCardsArgs(),
  ): Promise<PaginatedCards> => {
    if (!searchCriteria.attributes.fields.includes('id')) {
      searchCriteria.attributes.fields.push('id');
    }

    const take = 25;
    const { attributes, cost, types, expansions, rarities, classes, after } =
      searchCriteria;
    const cursorService = new CursorService();

    let afterCondition: WhereOptions;
    if (after) {
      const { entityId } = cursorService.decodeCursor(after);
      afterCondition = {
        id: {
          [Op.gt]: entityId,
        },
      };
    }

    const searchTerm = searchCriteria.searchTerm.toLowerCase();
    const searchTermCondition = [
      {
        name: {
          [Op.substring]: searchTerm,
        },
      },
      {
        trait: { [Op.substring]: searchTerm },
      },
    ];

    const costCondition = cost.map((costNum) => {
      return {
        cost: costNum < 8 ? { [Op.eq]: costNum } : { [Op.gt]: 8 },
      };
    });

    const typesCondition = types.map((type) => {
      return {
        type: { [Op.eq]: type },
      };
    });

    const expansionsCondition = {
      expansionId: { [Op.in]: expansions },
    };

    const raritiesCondition = {
      rarityId: { [Op.in]: rarities },
    };

    const classesCondition = {
      classId: { [Op.in]: classes },
    };

    const include: Includeable[] = this.getAssociations(attributes);
    const baseConditions = [
      Sequelize.or(...searchTermCondition),
      cost.length ? Sequelize.or(...costCondition) : [],
      types.length ? Sequelize.or(...typesCondition) : [],
      expansions.length ? expansionsCondition : [],
      rarities.length ? raritiesCondition : [],
      classes.length ? classesCondition : [],
      after ? afterCondition : [],
    ];

    const cards = await this.cardModel.findAll({
      where: Sequelize.and([...baseConditions, after ? afterCondition : []]),
      limit: take,
      attributes: attributes.fields,
      include,
    });

    const totalCount = await this.cardModel.count({
      where: Sequelize.and(baseConditions),
      include,
    });

    const edges: IEdgeType<Card>[] = cards.map((card) => {
      const cursor = cursorService.generateCursor({
        entityId: card.id,
      });
      return {
        node: card,
        cursor: cursor,
      };
    });

    const startCursor = edges.length > 0 ? edges[0].cursor : null;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    const hasNextPage = take + cards.length < totalCount;

    return {
      totalCount,
      edges,
      pageInfo: { startCursor, endCursor, hasNextPage },
    };
  };

  public async findById(args: FindByIdArgs): Promise<Card[]> {
    if (!args.attributes.fields.includes('id')) {
      args.attributes.fields.push('id');
    }

    const { attributes } = args;
    const include: Includeable[] = this.getAssociations(attributes);

    return this.cardModel.findAll({
      where: {
        id: {
          [Op.in]: args.ids,
        },
      },
      attributes: attributes.fields,
      limit: 61,
      include,
    });
  }

  /**
   * Retrieves an array of model inclusions.
   *
   * @param attributes The attributes to add to the query.
   * @returns
   */
  private getAssociations = (attributes: ParsedField): Includeable[] => {
    const include = [];
    const expansionAttr = attributes.relations.expansion;
    if (expansionAttr) {
      include.push(this.getExpansionAssociation(expansionAttr));
    }
    const rarityAttr = attributes.relations.rarity;
    if (rarityAttr) {
      include.push(this.getRarityAssociation(rarityAttr));
    }
    const classAttr = attributes.relations.class;
    if (classAttr) {
      include.push(this.getClassAssociation(classAttr));
    }
    return include;
  };

  private getExpansionAssociation = (attributes: ParsedField) => ({
    model: Expansion,
    attributes: attributes.fields,
  });

  private getRarityAssociation = (attributes: ParsedField) => ({
    model: Rarity,
    attributes: attributes.fields,
  });

  private getClassAssociation = (attributes: ParsedField) => ({
    model: Class,
    attributes: attributes.fields,
  });
}
