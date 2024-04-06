import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export abstract class RetrieveArgs {
  skip = 0;

  @Field(() => Int)
  take = 25;

  attributes: ParsedField;
}
