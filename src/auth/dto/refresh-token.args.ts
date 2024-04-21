import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RefreshTokenArgs {
  @Field(() => String)
  refreshToken: string;
}
