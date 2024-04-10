import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';
import { ParsedField } from 'src/common/decorators/fields.decorator';
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
    const include: Includeable[] = [];

    const cardsAttr = attrs.relations.cards;
    if (cardsAttr) {
      include.push(this.getCardAssociation(cardsAttr));
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
      attributes: attrs.fields,
      include,
    });
  }

  async findOne(id: number) {
    return await this.expansionModel.findOne({ where: { id } });
  }

  private getCardAssociation(field: ParsedField): Includeable {
    return {
      model: Card,
      attributes: field.fields,
    };
  }
}
