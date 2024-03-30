import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CardFields } from 'src/card/dto/retrieve.args';
import { Fields } from 'src/utils/graphql/decorators/fields.decorator';
import { ExpansionAttributes, ExpansionFields } from './dto/fetch.args';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { ExpansionService } from './expansion.service';

@Resolver(() => Expansion)
export class ExpansionResolver {
  constructor(private readonly expansionService: ExpansionService) {}

  @Query(() => [Expansion], { name: 'expansions' })
  async findAll(
    @Args() args: FindAllExpansionsArgs,
    @Fields<ExpansionFields, CardFields>()
    attributes: ExpansionAttributes[],
  ) {
    args.attributes = attributes;
    return await this.expansionService.findAll(args);
  }

  @Query(() => Expansion, { name: 'expansion' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.expansionService.findOne(id);
  }
}
