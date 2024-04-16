import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';
import { CursorService } from 'src/common/cursor.service';
import { ParsedField } from 'src/common/decorators/fields.decorator';
import { IEdgeType } from 'src/common/interfaces/paginated.interface';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { PaginatedExpansions } from './entities/paginated-expansions.entity';

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
  }: FindAllExpansionsArgs): Promise<PaginatedExpansions> {
    if (!attrs.fields.includes('id')) {
      attrs.fields.push('id');
    }
    const cursorService = new CursorService();
    const include: Includeable[] = [];
    const take = 1;

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
    const expansions = await this.expansionModel.findAll({
      where: whereOptions,
      limit: take,
      attributes: attrs.fields,
      include,
    });

    const totalCount = await this.expansionModel.count({
      where: whereOptions,
    });

    const edges: IEdgeType<Expansion>[] = expansions.map((expansion) => {
      const cursor = cursorService.generateCursor({
        entityId: expansion.id,
      });
      return {
        cursor,
        node: expansion,
      };
    });

    return {
      edges,
      totalCount,
      pageInfo: {
        hasNextPage: false,
      },
    };
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
