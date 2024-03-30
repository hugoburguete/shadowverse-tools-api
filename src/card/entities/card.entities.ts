import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Expansion } from 'src/expansion/entities/expansion.entity';

@ObjectType()
@Table({ timestamps: false })
export class Card extends Model {
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
  type: string;

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

  @Field(() => String, { nullable: true })
  @Column
  rarity?: string;
}
