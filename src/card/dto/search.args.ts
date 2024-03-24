import { ArgsType, Field } from '@nestjs/graphql';
import { RetrievingArgs } from './retrieving.arts';

@ArgsType()
export class SearchCardsArgs extends RetrievingArgs {
  @Field(() => String)
  searchTerm = '';
}
