import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeckCardInput {
  @Field(() => Int)
  quantity: number;

  // Card association
  @Field(() => Int)
  cardId: number;

  deckId: number;
}
