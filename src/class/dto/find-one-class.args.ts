import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export class FindOneClassArgs {
  @Field(() => Int)
  id: number;

  attributes: ParsedField;
}
