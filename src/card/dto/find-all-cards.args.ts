import { ArgsType, Field, Int } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/base/dto/retrieve.args';
import { CardType } from '../entities/card.entity';

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

  @Field(() => [Int])
  classes: number[] = [];
}
