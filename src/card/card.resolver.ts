import { Args, Query, Resolver } from '@nestjs/graphql';
import { Card } from './card.model';
import { CardService } from './card.service';
import { SearchCardsArgs } from './dto/search.args';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query(() => [Card])
  async getCards(): Promise<Card[]> {
    return await this.cardService.findAll();
  }

  @Query(() => [Card])
  async searchCards(@Args() searchCardsArgs: SearchCardsArgs): Promise<Card[]> {
    return this.cardService.searchCards(searchCardsArgs);
  }
}
