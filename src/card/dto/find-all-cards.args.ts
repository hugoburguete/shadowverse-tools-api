import { ArgsType, Field, Int } from '@nestjs/graphql';
import { CardType } from '../entities/card.entity';
import { RetrieveArgs } from './retrieve.args';

@ArgsType()
export class FindAllCardsArgs extends RetrieveArgs {
  @Field(() => String)
  searchTerm: string = '';

  @Field(() => [Int])
  cost: number[] = [];

  @Field(() => [String])
  types: CardType[] = [];

  @Field(() => [Int])
  expansions: number[] = [];

  @Field(() => [Int])
  rarities: number[] = [];
}
