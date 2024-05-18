import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expansion } from '../expansion/entities/expansion.entity';
import { Rarity } from '../rarity/entities/rarity.entity';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [SequelizeModule.forFeature([Card, Expansion, Rarity])],
  providers: [CardService, CardResolver],
})
export class CardsModule {}
