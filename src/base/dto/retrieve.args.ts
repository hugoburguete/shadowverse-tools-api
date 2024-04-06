import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export abstract class RetrieveArgs {
  @Field(() => Int, { description: 'The amount of resource items to skip.' })
  skip = 0;

  @Field(() => Int, { description: 'The amount of resource items to return.' })
  take = 25;

  attributes: ParsedField;
}
