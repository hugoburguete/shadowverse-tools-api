import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Fields, ParsedField } from '../common/decorators/fields.decorator';
import { ResourceNotFoundError } from '../common/errors/resource-not-found.error';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { PaginatedExpansions } from './entities/paginated-expansions.entity';
import { ExpansionService } from './expansion.service';

@Resolver(() => Expansion)
export class ExpansionResolver {
  constructor(private readonly expansionService: ExpansionService) {}

  @Query(() => PaginatedExpansions, { name: 'expansions' })
  async findAll(
    @Args() args: FindAllExpansionsArgs,
    @Fields() attributes: ParsedField,
  ) {
    args.attributes = attributes.relations['edges']?.relations['node'] || {
      fields: ['id'],
      relations: {},
    };
    return await this.expansionService.findAll(args);
  }

  @Query(() => Expansion, { name: 'expansion' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const expansion = await this.expansionService.findOne(id);
    if (!expansion) {
      throw new ResourceNotFoundError(
        `Could not find expansion with id ${id}.`,
      );
    }
    return expansion;
  }
}
