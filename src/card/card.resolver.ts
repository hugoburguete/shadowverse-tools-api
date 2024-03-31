import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Fields,
  ParsedField,
} from 'src/utils/graphql/decorators/fields.decorator';
import { CardService } from './card.service';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { Card } from './entities/card.entity';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query(() => [Card], { name: 'cards' })
  async findAll(
    @Args() searchCardsArgs: FindAllCardsArgs,
    @Fields() attributes: ParsedField,
  ): Promise<Card[]> {
    searchCardsArgs.attributes = attributes;
    return this.cardService.findAll(searchCardsArgs);
  }
}
