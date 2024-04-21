import { ArgsType, Field, Int } from '@nestjs/graphql';
import { CreateDeckInput } from './create-deck.input';

@ArgsType()
export class UpdateDeckInput {
  @Field(() => Int)
  id: number;

  @Field(() => CreateDeckInput)
  input: Partial<CreateDeckInput>;
}
