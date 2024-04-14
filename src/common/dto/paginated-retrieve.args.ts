import { ArgsType, Field } from '@nestjs/graphql';
import { RetrieveArgs } from './retrieve.args';

@ArgsType()
export abstract class PaginatedRetrieveArgs extends RetrieveArgs {
  @Field(() => String, {
    nullable: true,
    description: 'A cursor of a resource to perform a pagination search',
  })
  after?: string;
}
