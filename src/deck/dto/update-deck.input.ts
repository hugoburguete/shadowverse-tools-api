import { CreateDeckInput } from './create-deck.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDeckInput extends PartialType(CreateDeckInput) {
  @Field(() => Int)
  id: number;
}
