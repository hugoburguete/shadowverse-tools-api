import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, Min } from 'class-validator';

@ArgsType()
export abstract class CreateUserArgs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Min(12)
  @Field(() => String)
  password: string;
}
