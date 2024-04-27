import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService, AuthUser } from './auth.service';
import { CurrentUser } from './decorators/currentuser.decorator';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login.response';
import { RefreshTokenArgs } from './dto/refresh-token.args';
import { RegisterInput } from './dto/register.input';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') args: LoginInput,
    @CurrentUser() user: AuthUser,
  ): Promise<LoginResponse> {
    return await this.authService.login(user);
  }

  @Mutation(() => LoginResponse)
  async register(
    @Args('registerInput') args: RegisterInput,
  ): Promise<LoginResponse> {
    return await this.authService.register(args);
  }

  @UseGuards(RefreshJwtGuard)
  @Mutation(() => LoginResponse)
  async refreshToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args() args: RefreshTokenArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.authService.refreshToken(user);
  }
}
