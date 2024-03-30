import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { ExpansionAttributes } from 'src/expansion/dto/fetch.args';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { FindAllCardsArgs } from './dto/find-all.args';
import { CardFields } from './dto/retrieve.args';
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
    const attributes = attrs
      .filter((a) => a.name !== 'expansion')
      .map((attr) => attr.name);

    const include: Includeable[] = [];

    const expansionAttr = attrs.find((a) => a.name === 'expansion');
    if (expansionAttr) {
      include.push(this.getExpansionAssociation(expansionAttr.children));
    }

    return await this.cardModel.findAll({
      offset: skip,
      limit: take,
      attributes,
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
    attributes: CardFields[],
  ): Promise<Card[]> {
    const { skip, take } = searchCriteria;
    // if (this.isEmptySearch(searchCriteria)) {
    //   return this.findAll({ skip, take });
    // }

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

    return await this.cardModel.findAll({
      where: Sequelize.and([
        Sequelize.or(...searchTermCondition),
        cost.length ? Sequelize.or(...costCondition) : [],
        types.length ? Sequelize.or(...typesCondition) : [],
      ]),
      offset: skip,
      limit: take,
      attributes,
    });
  }

  getExpansionAssociation = (attributes: ExpansionAttributes[]) => ({
    model: Expansion,
    attributes: attributes.map((attr) => attr.name),
  });
}
