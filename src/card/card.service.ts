import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';
import { FindAllCardsArgs } from './dto/find-all.args';
import { SearchCardsArgs } from './dto/search.args';
import { Card } from './entities/card.entities';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card)
    private cardModel: typeof Card,
  ) {}

  /**
   * Retrieves all cards
   */
  async findAll(
    {
      attributes: attrs,
      skip,
      take,
    }: FindAllCardsArgs = new FindAllCardsArgs(),
  ): Promise<Card[]> {
    const include: Includeable[] = this.getAssociations(attrs);

    return await this.cardModel.findAll({
      offset: skip,
      limit: take,
      attributes: attrs.fields,
      include,
    });
  }

  /**
   * Helper function that determines if a search is completely empty
   */
  private isEmptySearch({ searchTerm, cost, types }: SearchCardsArgs): boolean {
    return !searchTerm && !cost.length && !types.length;
  }

  /**
   * Searches for cards.
   *
   * @param searchCriteria Search options
   * @returns the card results that match the search criteria
   */
  async searchCards(
    searchCriteria: SearchCardsArgs = new SearchCardsArgs(),
  ): Promise<Card[]> {
    const { skip, take, attributes } = searchCriteria;
    if (this.isEmptySearch(searchCriteria)) {
      return this.findAll(searchCriteria);
    }

    const { cost, types } = searchCriteria;

    const searchTerm = searchCriteria.searchTerm.toLowerCase();
    const searchTermCondition = [
      {
        name: {
          [Op.substring]: searchTerm,
        },
      },
      {
        class: { [Op.substring]: searchTerm },
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

    const include: Includeable[] = this.getAssociations(attributes);

    return await this.cardModel.findAll({
      where: Sequelize.and([
        Sequelize.or(...searchTermCondition),
        cost.length ? Sequelize.or(...costCondition) : [],
        types.length ? Sequelize.or(...typesCondition) : [],
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
    return include;
  };

  private getExpansionAssociation = (attributes: ParsedField) => ({
    model: Expansion,
    attributes: attributes.fields,
  });
}
