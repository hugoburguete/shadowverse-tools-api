import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@ObjectType()
@Table({ timestamps: false })
export class Card extends Model {
  @Field(() => String)
  @Column
  cardId: string;

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

  @Field(() => String)
  @Column
  rarity: string;
}
