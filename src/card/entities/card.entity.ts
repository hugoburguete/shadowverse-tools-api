import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { Rarity } from './rarity.entity';

export type CardType = 'Follower' | 'Follower / Evolve' | 'Spell' | 'Leader';

@ObjectType()
@Table({ timestamps: false })
export class Card extends Model<Card> {
  @Field(() => String)
  @Column
  cardId: string;

  @Field(() => Int)
  @ForeignKey(() => Expansion)
  @Column
  expansionId: string;

  @Field(() => Expansion)
  @BelongsTo(() => Expansion)
  expansion: Expansion;

  @Field(() => String)
  @Column
  name: string;

  @Field(() => String)
  @Column
  type: CardType;

  @Field(() => String)
  @Column
  class: string;

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
  rarity: Rarity;
}
