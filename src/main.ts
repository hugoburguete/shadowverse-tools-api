import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // TODO: This should probably be something a bit more dynamic
    origin: ['http://localhost:3000'],
  });
  await app.listen(1337);
}
bootstrap();
