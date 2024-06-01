import { UserInputError } from '@nestjs/apollo';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints),
        );
        return new UserInputError(
          `Invalid payload: ${errorMessages.join(',')}`,
        );
      },
    }),
  );
  app.enableCors({
    origin: [process.env.CLIENT_APP_URL],
  });
  await app.listen(1337);
}
bootstrap();
