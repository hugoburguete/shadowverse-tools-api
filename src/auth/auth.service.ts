import { AuthenticationError, ForbiddenError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginResponse } from './dto/login.response';
import { RegisterInput } from './dto/register.input';

export type AuthUser = Pick<User, 'id' | 'email'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new AuthenticationError(
        'Could not find an account with the email provided.',
      );
    }

    if (!compareSync(password, user.password)) {
      throw new AuthenticationError('Incorrect password.');
    }

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
  }

  async register(args: RegisterInput): Promise<LoginResponse> {
    const existingUser = await this.userService.findOne(args.email);
    if (existingUser) {
      throw new ForbiddenError('User already registered.');
    }

    const salt = genSaltSync(10);
    const hash = hashSync(args.password, salt);

    args.password = hash;
    const newUser = await this.userService.create(args);
    return this.generateTokens(newUser);
  }

  async login(user: AuthUser): Promise<LoginResponse> {
    if (!user?.email) {
      throw new AuthenticationError('Incorrect credentials. Please try again');
    }

    const existingUser = await this.userService.findOne(user.email);
    if (!existingUser) {
      throw new AuthenticationError('Incorrect email. Please try again');
    }

    // TODO: Log user access

    // TODO: store refresh token

    return this.generateTokens(user);
  }

  async refreshToken(user: AuthUser) {
    return this.generateTokens(user);
  }

  private generateTokens(user: AuthUser) {
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('auth.tokens.access.expiry'),
        secret: this.configService.get<string>('auth.tokens.access.secret'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('auth.tokens.refresh.expiry'),
        secret: this.configService.get<string>('auth.tokens.refresh.secret'),
      }),
    };
  }
}
