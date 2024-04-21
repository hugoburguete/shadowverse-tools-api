import { ArgsType } from '@nestjs/graphql';
import { CreateUserArgs } from 'src/user/dto/create-user.args';

@ArgsType()
export class RegisterArgs extends CreateUserArgs {}
