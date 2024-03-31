import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Fields,
  ParsedField,
} from 'src/utils/graphql/decorators/fields.decorator';
import { CardService } from './card.service';
import { SearchCardsArgs } from './dto/search.args';
import { Card } from './entities/card.entities';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query(() => [Card])
  async getCards(
    @Args() searchCardsArgs: SearchCardsArgs,
    @Fields() attributes: ParsedField,
  ): Promise<Card[]> {
    searchCardsArgs.attributes = attributes;
    return await this.cardService.findAll(searchCardsArgs);
  }

  @Query(() => [Card])
  async searchCards(
    @Args() searchCardsArgs: SearchCardsArgs,
    @Fields() attributes: ParsedField,
  ): Promise<Card[]> {
    searchCardsArgs.attributes = attributes;
    return this.cardService.searchCards(searchCardsArgs);
  }
}
