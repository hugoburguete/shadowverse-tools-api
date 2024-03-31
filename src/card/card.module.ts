import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expansion } from 'src/expansion/entities/expansion.entity';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [SequelizeModule.forFeature([Card, Expansion])],
  providers: [CardService, CardResolver],
})
export class CardsModule {}
