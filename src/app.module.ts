import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './card/card.module';
import { Card } from './card/entities/card.entity';
import { ClassModule } from './class/class.module';
import { Class } from './class/entities/class.entity';
import configuration from './config/configuration';
import { DeckModule } from './deck/deck.module';
import { DeckCard } from './deck/entities/deck-card.entity';
import { Deck } from './deck/entities/deck.entity';
import { Expansion } from './expansion/entities/expansion.entity';
import { ExpansionModule } from './expansion/expansion.module';
import { Rarity } from './rarity/entities/rarity.entity';
import { RarityModule } from './rarity/rarity.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'env.example'],
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      formatError: (error) => ({
        message: error.message,
        extensions: {
          code: error.extensions.code,
        },
      }),
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DATABASE_TYPE,
      dialectOptions: {
        ssl: process.env.APP_ENV === 'production',
      },
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      models: [Card, Expansion, Rarity, Class, User, Deck, DeckCard],
    } as SequelizeModuleOptions),
    CardsModule,
    ExpansionModule,
    RarityModule,
    ClassModule,
    AuthModule,
    UserModule,
    DeckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
