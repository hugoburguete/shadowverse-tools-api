import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateUserArgs } from 'src/user/dto/create-user.args';

@ArgsType()
export class RegisterArgs extends CreateUserArgs {
  @Min(12)
  @Field(() => String)
  confirmPassword: string;
}
