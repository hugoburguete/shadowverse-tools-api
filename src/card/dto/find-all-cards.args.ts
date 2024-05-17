import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginatedRetrieveArgs } from 'src/common/dto/paginated-retrieve.args';
import { CardType } from '../entities/card.entity';

@ArgsType()
export class FindAllCardsArgs extends PaginatedRetrieveArgs {
  @Field(() => String, {
    description:
      'Provide a search term to filter the card result. This will search for cards with a similar name or trait as the search term passed through.',
  })
  searchTerm: string = '';

  @Field(() => [Int], {
    description:
      'Provide an array of costs to filter cards by their play point cost.',
  })
  cost: number[] = [];

  @Field(() => [String], {
    description:
      'Provide an array of types to filter by the type of card required.',
  })
  types: `${CardType}`[] = [];

  @Field(() => [Int])
  expansions: number[] = [];

  @Field(() => [Int])
  rarities: number[] = [];

  @Field(() => [Int])
  classes: number[] = [];
}
