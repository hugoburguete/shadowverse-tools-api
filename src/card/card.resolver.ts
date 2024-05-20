import { Args, Query, Resolver } from '@nestjs/graphql';
import { Fields, ParsedField } from '../common/decorators/fields.decorator';
import { CardService } from './card.service';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { FindByIdArgs } from './dto/find-by-id.args';
import { Card } from './entities/card.entity';
import { PaginatedCards } from './entities/paginated-card.entity';

@Resolver('Card')
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query(() => PaginatedCards, { name: 'cards' })
  async findAll(
    @Args({ description: 'Arguments for filtered cards.' })
    searchCardsArgs: FindAllCardsArgs,
    @Fields() attributes: ParsedField,
  ): Promise<PaginatedCards> {
    searchCardsArgs.attributes = attributes.relations['edges']?.relations[
      'node'
    ] || { fields: ['id'], relations: {} };
    return this.cardService.findAll(searchCardsArgs);
  }

  @Query(() => [Card], { name: 'cardsById' })
  async findById(
    @Args({ description: 'Arguments for filtered cards.' })
    findByIdArgs: FindByIdArgs,
    @Fields() attributes: ParsedField,
  ): Promise<Card[]> {
    findByIdArgs.attributes = attributes;
    return this.cardService.findById(findByIdArgs);
  }
}
