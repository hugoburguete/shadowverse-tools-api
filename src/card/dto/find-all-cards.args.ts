import { ArgsType, Field, Int } from '@nestjs/graphql';
import { RetrieveArgs } from './retrieve.args';

@ArgsType()
export class FindAllCardsArgs extends RetrieveArgs {
  @Field(() => String)
  searchTerm = '';

  @Field(() => [Int])
  cost = [];

  @Field(() => [String])
  types = [];

  @Field(() => [Int])
  expansions = [];
}
