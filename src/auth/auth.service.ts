import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginResponse } from './dto/login.response';
import { RegisterArgs } from './dto/register.args';

export type AuthUser = Pick<User, 'id' | 'email'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(email);

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Incorrect password.');
    }

    if (user && compareSync(password, user.password)) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    return null;
  }

  async register(args: RegisterArgs): Promise<LoginResponse> {
    const existingUser = await this.userService.findOne(args.email);
    if (existingUser) {
      throw new UnauthorizedException('User already registered.');
    }

    const salt = genSaltSync(10);
    const hash = hashSync(args.password, salt);

    args.password = hash;
    const newUser = await this.userService.create(args);
    return this.login(newUser);
  }

  async login(user: AuthUser): Promise<LoginResponse> {
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
        expiresIn: process.env.ACCESS_EXPIRY,
        secret: process.env.ACCESS_JWT_SECRET,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_EXPIRY,
        secret: process.env.REFRESH_JWT_SECRET,
      }),
    };
  }
}
