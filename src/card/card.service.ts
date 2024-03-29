import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Card } from './card.model';
import { FindAllCardsArgs } from './dto/find-all.args';
import { CardProperties } from './dto/retrieve.args';
import { SearchCardsArgs } from './dto/search.args';

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
    findAllCriteria: FindAllCardsArgs = new FindAllCardsArgs(),
  ): Promise<Card[]> {
    return await this.cardModel.findAll({
      offset: findAllCriteria.skip,
      limit: findAllCriteria.take,
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
    attributes: CardProperties[],
  ): Promise<Card[]> {
    const { skip, take } = searchCriteria;
    if (this.isEmptySearch(searchCriteria)) {
      return this.findAll({ skip, take });
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
}
