import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { Class } from 'src/class/entities/class.entity';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';
import { Rarity } from '../rarity/entities/rarity.entity';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card)
    private cardModel: typeof Card,
  ) {}

  /**
   * Helper function that determines if a search is completely empty
   */
  private isEmptySearch({
    searchTerm,
    cost,
    types,
    expansions,
    rarities,
    classes,
  }: FindAllCardsArgs): boolean {
    return (
      !searchTerm &&
      !cost.length &&
      !types.length &&
      !expansions.length &&
      !rarities.length &&
      !classes.length
    );
  }

  /**
   * Searches for cards.
   *
   * @param searchCriteria Search options
   * @returns the card results that match the search criteria
   */
  async findAll(
    searchCriteria: FindAllCardsArgs = new FindAllCardsArgs(),
  ): Promise<Card[]> {
    const { skip, take, attributes } = searchCriteria;

    const include: Includeable[] = this.getAssociations(attributes);

    if (this.isEmptySearch(searchCriteria)) {
      return await this.cardModel.findAll({
        offset: skip,
        limit: take,
        attributes: attributes.fields,
        include,
      });
    }

    const { cost, types, expansions, rarities, classes } = searchCriteria;

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

    return await this.cardModel.findAll({
      where: Sequelize.and([
        Sequelize.or(...searchTermCondition),
        cost.length ? Sequelize.or(...costCondition) : [],
        types.length ? Sequelize.or(...typesCondition) : [],
        expansions.length ? expansionsCondition : [],
        rarities.length ? raritiesCondition : [],
        classes.length ? classesCondition : [],
      ]),
      offset: skip,
      limit: take,
      attributes: attributes.fields,
      include,
    });
  }

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
