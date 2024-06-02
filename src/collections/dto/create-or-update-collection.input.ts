import { Field, InputType } from '@nestjs/graphql';
import { CollectionCardInput } from './collection-card-input';

@InputType()
export class CreateOrUpdateCollectionInput {
  @Field(() => [CollectionCardInput], {
    description: 'The cards to add to the collection',
  })
  cardsToAdd?: CollectionCardInput[];

  @Field(() => [CollectionCardInput], {
    description: 'The cards to remove to the collection',
  })
  cardsToRemove?: CollectionCardInput[];

  userId: number;
}
