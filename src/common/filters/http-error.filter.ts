import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        response.status(exception.getStatus()).json({
          message: exception.message,
        });
        break;
      case 'graphql':
        return new GraphQLError(exception.message, {
          extensions: {
            code: exception.name,
          },
        });
    }
  }
}
