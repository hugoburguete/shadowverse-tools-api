import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Card {
  @Field(() => String)
  cardId: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  class: string;

  @Field({ nullable: true })
  trait?: string;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field(() => Int, { nullable: true })
  attack?: number;

  @Field(() => Int, { nullable: true })
  health?: number;

  @Field(() => String)
  image: string;
}
