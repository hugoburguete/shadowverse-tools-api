import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/card/entities/card.entity';
import { UserModule } from 'src/user/user.module';
import { DeckResolver } from './deck.resolver';
import { DeckService } from './deck.service';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';

@Module({
  imports: [SequelizeModule.forFeature([Card, Deck, DeckCard]), UserModule],
  providers: [DeckResolver, DeckService],
})
export class DeckModule {}
