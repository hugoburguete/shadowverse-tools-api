import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Card } from './card/card.model';
import { CardsModule } from './card/card.module';

@Module({
  imports: [
    CardsModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_DOCKER_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      models: [Card],
    } as SequelizeModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
