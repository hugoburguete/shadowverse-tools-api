import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FetchArgs } from './fetch.args';

@ArgsType()
export class FindAllExpansionsArgs extends FetchArgs {
  @Field(() => [Int], { description: 'The IDs of the expansions to retrieve.' })
  ids: number[] = [];

  @Field(() => [String], {
    description: 'The slugs of the expansions to retrieve.',
  })
  slugs: string[] = [];
}
