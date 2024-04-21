import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Class } from 'src/class/entities/class.entity';
import { DeckCard } from 'src/deck/entities/deck-card.entity';
import { Deck } from 'src/deck/entities/deck.entity';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { Rarity } from '../../rarity/entities/rarity.entity';

export type CardType = 'Follower' | 'Follower / Evolve' | 'Spell' | 'Leader';

@ObjectType()
@Table({ timestamps: false })
export class Card extends Model<Card, Partial<Card>> {
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
  type: CardType;

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
