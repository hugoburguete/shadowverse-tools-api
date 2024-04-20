import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn, Max, Min } from 'class-validator';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { DeckCard } from './deck-card.entity';

export type DeckFormat = 'standard' | 'gloryfinder';

@ObjectType()
@Table
export class Deck extends Model {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @IsIn(['standard', 'gloryfinder'])
  @Field(() => String, { description: 'The game format this deck belongs to.' })
  @Column
  format: DeckFormat;

  @Min(3)
  @Max(30)
  @Field(() => String, { description: 'The deck name.' })
  @Column
  name: string;

  // Card Association
  @BelongsToMany(() => Card, () => DeckCard, 'cardId')
  @Field(() => [DeckCard], { description: 'The cards this deck contains.' })
  deckCards: DeckCard[];

  // User Association
  @Field(() => Int)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
