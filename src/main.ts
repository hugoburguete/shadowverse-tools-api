import { UserInputError } from '@nestjs/apollo';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';

async function bootstrap() {
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
    // TODO: This should probably be something a bit more dynamic
    origin: ['http://localhost:3000'],
  });
  await app.listen(1337);
}
bootstrap();
