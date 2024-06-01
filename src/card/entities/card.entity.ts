import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Class } from '../../class/entities/class.entity';
import { DeckCard } from '../../deck/entities/deck-card.entity';
import { Deck } from '../../deck/entities/deck.entity';
import { Expansion } from '../../expansion/entities/expansion.entity';
import { Rarity } from '../../rarity/entities/rarity.entity';

export enum CardType {
  FOLLOWER = 'Follower',
  FOLLOWER_EVOLVE = 'Follower / Evolve',
  SPELL = 'Spell',
  LEADER = 'Leader',
}

@ObjectType()
@Table({ timestamps: false, tableName: 'cards' })
export class Card extends Model<Card, Partial<Card>> {
  @Field(() => Int)
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Field(() => String)
  @Column
  cardId: string;

  @Field(() => Int)
  @ForeignKey(() => Expansion)
  @Column
  expansionId: string;

  @Field(() => Expansion)
  @BelongsTo(() => Expansion)
  expansion?: Expansion;

  @Field(() => String)
  @Column
  name: string;

  @Field(() => String)
  @Column
  type: `${CardType}`;

  @Field(() => Int)
  @ForeignKey(() => Class)
  @Column
  classId?: number;

  @Field(() => Class)
  @BelongsTo(() => Class)
  class?: Class;

  @Field({ nullable: true })
  @Column
  trait?: string;

  @Field(() => Int, { nullable: true })
  @Column
  cost?: number;

  @Field(() => Int, { nullable: true })
  @Column
  attack?: number;

  @Field(() => Int, { nullable: true })
  @Column
  health?: number;

  @Field(() => String)
  @Column
  image: string;

  @Field(() => Int)
  @ForeignKey(() => Rarity)
  @Column
  rarityId?: number;

  @Field(() => Rarity)
  @BelongsTo(() => Rarity)
  rarity?: Rarity;

  @BelongsToMany(() => Deck, () => DeckCard, 'cardId')
  decks: Deck;
}
