import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, Max, Min } from 'class-validator';

@ArgsType()
export abstract class CreateUserArgs {
  @Min(3)
  @Max(40)
  @Field(() => String)
  firstname: string;

  @Min(3)
  @Max(40)
  @Field(() => String)
  lastname: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Min(12)
  @Field(() => String)
  password: string;
}
