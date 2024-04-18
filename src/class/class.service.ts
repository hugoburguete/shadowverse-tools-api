import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CursorService } from 'src/common/cursor.service';
import { IEdgeType } from 'src/common/interfaces/paginated.interface';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
import { FindOneClassArgs } from './dto/find-one-class.args';
import { Class } from './entities/class.entity';
import { PaginatedClasses } from './entities/paginated-classes.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class)
    private readonly classModel: typeof Class,
  ) {}

  async findOne({ attributes: attrs, id }: FindOneClassArgs) {
    return await this.classModel.findOne<Class>({
      attributes: attrs.fields,
      where: { id },
    });
  }

  async findAll({
    attributes: attrs,
    after,
  }: FindAllClassesArgs): Promise<PaginatedClasses> {
    if (!attrs.fields.includes('id')) {
      attrs.fields.push('id');
    }
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

    const classes = await this.classModel.findAll({
      attributes: attrs.fields,
      where: after ? afterCondition : null,
    });

    const totalCount = await this.classModel.count();

    const edges: IEdgeType<Class>[] = classes.map((clax) => {
      const cursor = cursorService.generateCursor({
        entityId: clax.id,
      });
      return {
        node: clax,
        cursor: cursor,
      };
    });

    const startCursor = edges.length > 0 ? edges[0].cursor : null;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
    const hasNextPage = false;

    return {
      edges,
      totalCount,
      pageInfo: {
        hasNextPage,
        startCursor,
        endCursor,
      },
    };
  }
}
