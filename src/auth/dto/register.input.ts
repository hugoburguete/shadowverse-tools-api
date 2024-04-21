import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @MinLength(3)
  @MaxLength(40)
  @Field(() => String)
  firstname: string;

  @MinLength(3)
  @MaxLength(40)
  @Field(() => String)
  lastname: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @MinLength(12)
  @Field(() => String)
  password: string;
}
