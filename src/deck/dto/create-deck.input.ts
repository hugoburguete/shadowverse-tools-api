import { Field, InputType } from '@nestjs/graphql';
import { IsIn, MaxLength, MinLength } from 'class-validator';
import { DeckFormat } from '../entities/deck.entity';
import { DeckCardInput } from './deck-card.input';

@InputType()
export class CreateDeckInput {
  @MinLength(3)
  @MaxLength(30)
  @Field(() => String, {
    description:
      'The deck name. The deck name should be 3 to 30 characters long.',
  })
  name: string;

  @IsIn(['standard', 'gloryfinder'])
  @Field(() => String, { description: 'The game format this deck belongs to.' })
  format: `${DeckFormat}`;

  @Field(() => [DeckCardInput], {
    description: 'The cards this deck contains.',
  })
  deckCards: DeckCardInput[];

  userId: number;
}
