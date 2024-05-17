import { AuthenticationError } from '@nestjs/apollo';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<TUser = Pick<User, 'id' | 'email'>>(
    err: any,
    user: TUser,
    info: any,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new AuthenticationError(info.message, {
        extensions: {
          code: 'TOKEN_EXPIRED',
        },
      });
    }

    if (err || !user) {
      throw err || new AuthenticationError('UNAUTHORIZED');
    }
    return user;
  }
}
