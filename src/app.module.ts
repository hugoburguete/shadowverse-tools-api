import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './card/card.module';
import { Card } from './card/entities/card.entity';
import { ClassModule } from './class/class.module';
import { Class } from './class/entities/class.entity';
import { Expansion } from './expansion/entities/expansion.entity';
import { ExpansionModule } from './expansion/expansion.module';
import { Rarity } from './rarity/entities/rarity.entity';
import { RarityModule } from './rarity/rarity.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      formatError: (error) => ({
        code: error.extensions?.code,
        message: error.message,
      }),
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      models: [Card, Expansion, Rarity, Class],
    } as SequelizeModuleOptions),
    CardsModule,
    ExpansionModule,
    RarityModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
