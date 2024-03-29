import { Args, Info, Query, Resolver } from '@nestjs/graphql';
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
  async searchCards(
    @Args() searchCardsArgs: SearchCardsArgs,
    @Info() info,
  ): Promise<Card[]> {
    // TODO: Replace this with https://github.com/Jenyus-Org/graphql-utils?tab=readme-ov-file#installation
    const attributes = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return this.cardService.searchCards(searchCardsArgs, attributes);
  }
}
