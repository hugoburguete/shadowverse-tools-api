import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import { Fields, ParsedField } from 'src/common/decorators/fields.decorator';
import { ResourceNotFoundError } from 'src/common/errors/resource-not-found.error';
import { ClassService } from './class.service';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
import { FindOneClassArgs } from './dto/find-one-class.args';
import { Class } from './entities/class.entity';
import { PaginatedClasses } from './entities/paginated-classes.entity';

@Resolver(() => Card)
export class ClassResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly classService: ClassService,
  ) {}

  @Query(() => Class, { name: 'class' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Fields() attributes: ParsedField,
  ) {
    const args = new FindOneClassArgs();
    if (!attributes.fields.length) {
      attributes.fields.push('id');
    }
    args.attributes = attributes;
    args.id = id;
    const clax = await this.classService.findOne(args);
    if (!clax) {
      throw new ResourceNotFoundError(`Could not find class with id ${id}.`);
    }
    return clax;
  }

  @Query(() => PaginatedClasses, { name: 'classes' })
  async findAll(
    @Args() args: FindAllClassesArgs,
    @Fields() attributes: ParsedField,
  ) {
    args.attributes = attributes.relations['edges']?.relations['node'] || {
      fields: ['id'],
      relations: {},
    };
    return await this.classService.findAll(args);
  }
}
