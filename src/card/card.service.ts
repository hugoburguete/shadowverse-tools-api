import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Card } from './card.model';
import { FindAllCardsArgs } from './dto/find-all.args';
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
  private isEmptySearch(searchCriteria: SearchCardsArgs): boolean {
    return !searchCriteria.searchTerm;
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
    const { skip, take } = searchCriteria;
    if (this.isEmptySearch(searchCriteria)) {
      return this.findAll({ skip, take });
    }

    const searchTerm = searchCriteria.searchTerm.toLowerCase();
    return await this.cardModel.findAll({
      where: {
        [Op.or]: [
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
        ],
      },
      offset: skip,
      limit: take,
    });
  }
}
