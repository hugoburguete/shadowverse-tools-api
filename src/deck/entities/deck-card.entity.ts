import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';
import { Deck } from './deck.entity';

@ObjectType()
@Table({ tableName: 'deck_cards' })
export class DeckCard extends Model {
  @Column({ primaryKey: true })
  id?: number;

  @Field(() => Int)
  @Column
  quantity: number;

  // Card association
  @ForeignKey(() => Card)
  @Field(() => Int)
  @Column
  cardId: number;

  @BelongsTo(() => Card)
  @Field(() => Card)
  card?: Card;

  // Deck association
  @ForeignKey(() => Deck)
  @Field(() => Int)
  @Column
  deckId?: number;

  @BelongsTo(() => Deck)
  @Field(() => Deck)
  deck?: Deck;
}
