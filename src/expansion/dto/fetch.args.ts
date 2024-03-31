import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export abstract class FetchArgs {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  take = 1;

  attributes: ParsedField;
}
