import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { ExpansionFields } from 'src/expansion/dto/fetch.args';
import { Fields } from 'src/utils/graphql/decorators/fields.decorator';
import { CardService } from './card.service';
import { CardAttributes, CardFields } from './dto/retrieve.args';
import { SearchCardsArgs } from './dto/search.args';
import { Card } from './entities/card.entities';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query(() => [Card])
  async getCards(
    @Args() searchCardsArgs: SearchCardsArgs,
    @Fields<CardFields, ExpansionFields>()
    attributes: CardAttributes[],
  ): Promise<Card[]> {
    searchCardsArgs.attributes = attributes;
    return await this.cardService.findAll(searchCardsArgs);
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
    console.log(JSON.stringify(attributes));
    return this.cardService.searchCards(searchCardsArgs, attributes);
  }
}
