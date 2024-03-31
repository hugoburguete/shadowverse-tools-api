import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export abstract class RetrieveArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  attributes: ParsedField;
}
