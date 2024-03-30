import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { CardAttributes } from 'src/card/dto/retrieve.args';
import { Card } from 'src/card/entities/card.entities';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';

@Injectable()
export class ExpansionService {
  constructor(
    @InjectModel(Expansion)
    private readonly expansionModel: typeof Expansion,
  ) {}
  async findAll({
    attributes: attrs,
    ids,
    slugs,
    skip,
    take,
  }: FindAllExpansionsArgs): Promise<Expansion[]> {
    const attributes = attrs
      .filter((a) => a.name !== 'cards')
      .map((attr) => attr.name);

    const include: Includeable[] = [];

    const cardsAttr = attrs.find((a) => a.name === 'cards');
    if (cardsAttr) {
      include.push(this.getCardAssociation(cardsAttr.children));
    }

    const whereArgs = [];
    if (ids.length) {
      whereArgs.push({
        id: {
          [Op.in]: ids,
        },
      });
    }

    if (slugs.length) {
      whereArgs.push({
        slug: {
          [Op.in]: slugs,
        },
      });
    }

    const whereOptions = whereArgs.length ? Sequelize.or(whereArgs) : null;
    return await this.expansionModel.findAll({
      where: whereOptions,
      offset: skip,
      limit: take,
      attributes,
      include,
    });
  }

  async findOne(id: number) {
    return await this.expansionModel.findOne({ where: { id } });
  }

  private getCardAssociation(attributes: CardAttributes[]): Includeable {
    return {
      model: Card,
      attributes: attributes.map((attr) => attr.name),
    };
  }
}
