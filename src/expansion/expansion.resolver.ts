import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import {
  Fields,
  ParsedField,
} from 'src/utils/graphql/decorators/fields.decorator';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { ExpansionService } from './expansion.service';

@Resolver(() => Expansion)
export class ExpansionResolver {
  constructor(private readonly expansionService: ExpansionService) {}

  @Query(() => [Expansion], { name: 'expansions' })
  async findAll(
    @Args() args: FindAllExpansionsArgs,
    @Fields() attributes: ParsedField,
  ) {
    args.attributes = attributes;
    return await this.expansionService.findAll(args);
  }

  @Query(() => Expansion, { name: 'expansion' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const expansion = await this.expansionService.findOne(id);
    if (!expansion) {
      throw new NotFoundException(id);
    }
    return expansion;
  }
}
