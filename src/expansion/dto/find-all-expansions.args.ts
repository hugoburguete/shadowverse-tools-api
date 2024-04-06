import { ArgsType, Field, Int } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/base/dto/retrieve.args';

@ArgsType()
export class FindAllExpansionsArgs extends RetrieveArgs {
  take = 1;

  @Field(() => [Int], { description: 'The IDs of the expansions to retrieve.' })
  ids: number[] = [];

  @Field(() => [String], {
    description: 'The slugs of the expansions to retrieve.',
  })
  slugs: string[] = [];
}
