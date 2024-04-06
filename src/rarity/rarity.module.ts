import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/card/entities/card.entity';
import { Rarity } from './entities/rarity.entity';
import { RarityResolver } from './rarity.resolver';
import { RarityService } from './rarity.service';

@Module({
  imports: [SequelizeModule.forFeature([Card, Rarity])],
  providers: [RarityResolver, RarityService],
})
export class RarityModule {}
