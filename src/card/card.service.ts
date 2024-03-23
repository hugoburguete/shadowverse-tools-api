import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Card } from './card.model';
import { SearchCardsArgs } from './dto/search.args';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card)
    private cardModel: typeof Card,
  ) {}

  async findAll(): Promise<Card[]> {
    return await this.cardModel.findAll();
  }

  async searchCards(searchCriteria: SearchCardsArgs): Promise<Card[]> {
    const searchTerm = searchCriteria.searchTerm.toLowerCase();
    return await this.cardModel.findAll({
      where: {
        name: {
          [Op.substring]: searchTerm,
        },
      },
    });
  }
}
