import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
