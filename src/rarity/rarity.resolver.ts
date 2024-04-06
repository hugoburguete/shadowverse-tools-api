import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Fields,
  ParsedField,
} from 'src/utils/graphql/decorators/fields.decorator';
import { FindAllRaritiesArgs } from './dto/find-all-rarities.args';
import { Rarity } from './entities/rarity.entity';
import { RarityService } from './rarity.service';

@Resolver()
export class RarityResolver {
  constructor(private readonly rarityService: RarityService) {}

  @Query(() => [Rarity], { name: 'rarities' })
  async findAll(
    @Args() args: FindAllRaritiesArgs,
    @Fields() attributes: ParsedField,
  ) {
    args.attributes = attributes;
    return await this.rarityService.findAll(args);
  }
}
