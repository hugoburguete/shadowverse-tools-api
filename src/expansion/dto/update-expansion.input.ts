import { CreateExpansionInput } from './create-expansion.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateExpansionInput extends PartialType(CreateExpansionInput) {
  @Field(() => Int)
  id: number;
}
