import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn, MaxLength, MinLength } from 'class-validator';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { DeckCard } from './deck-card.entity';

export enum DeckFormat {
  STANDARD = 'standard',
  GLORYFINDER = 'gloryfinder',
}

@ObjectType({
  description:
    'A Shadowverse evolve deck consisting of 1 leader, 40 to 50 main deck cards and up to 10 evolve cards',
})
@Table
export class Deck extends Model {
  @Field(() => Int, { description: 'The deck identifier.' })
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @IsIn(['standard', 'gloryfinder'])
  @Field(() => String, {
    description:
      'The game format this deck belongs to. The current deck formats supported are: standard and gloryfinder.',
  })
  @Column
  format: `${DeckFormat}`;

  @MinLength(3)
  @MaxLength(30)
  @Field(() => String, { description: 'The deck name.' })
  @Column
  name: string;

  // Card Association
  @BelongsToMany(() => Card, () => DeckCard, 'deckId')
  @Field(() => [Card], { description: 'The cards this deck contains.' })
  cards: Card[];

  @HasMany(() => DeckCard)
  @Field(() => [DeckCard], { description: 'The cards with quantity.' })
  cardsInfo: DeckCard[];

  // User Association
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
