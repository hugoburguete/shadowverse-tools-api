import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentuser.decorator';
import { LoginResponse } from './dto/login.response';
import { RegisterArgs } from './dto/register.args';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user' })
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
