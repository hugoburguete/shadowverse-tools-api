import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentuser.decorator';
import { LoginResponse } from './dto/login.response';
import { RefreshTokenArgs } from './dto/refresh-token.args';
import { RegisterArgs } from './dto/register.args';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse)
  async login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @CurrentUser() user: User,
  ): Promise<LoginResponse> {
    return await this.authService.login(user);
  }

  @Mutation(() => LoginResponse)
  async register(@Args() args: RegisterArgs): Promise<LoginResponse> {
    return await this.authService.register(args);
  }

  @UseGuards(RefreshJwtGuard)
  @Mutation(() => LoginResponse)
  async refreshToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args() args: RefreshTokenArgs,
    @CurrentUser() user: User,
  ) {
    return this.authService.refreshToken(user);
  }
}
