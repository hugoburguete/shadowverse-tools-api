import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CollectionCardInput {
  // Card association
  @Field(() => Int)
  cardId: number;

  collectionId?: number;
}
