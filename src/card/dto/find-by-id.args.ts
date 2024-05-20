import { ArgsType, Field, Int } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/common/dto/retrieve.args';

@ArgsType()
export class FindByIdArgs extends RetrieveArgs {
  @Field(() => [Int], {
    description: 'Provide the ids of the cards to be retrieved.',
  })
  ids: number[] = [];
}
