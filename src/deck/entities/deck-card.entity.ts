import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from '../../card/entities/card.entity';
import { Deck } from './deck.entity';

@ObjectType()
@Table({ tableName: 'deck_cards' })
export class DeckCard extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id?: number;

  @Field(() => Int)
  @Column
  quantity: number;

  // Card association
  @Field(() => Int)
  @ForeignKey(() => Card)
  @Column
  cardId: number;

  @BelongsTo(() => Card)
  card?: Card;

  // Deck association
  @ForeignKey(() => Deck)
  @Column
  deckId?: number;

  @BelongsTo(() => Deck)
  deck?: Deck;
}
