import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './card.model';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';

@Module({
  imports: [SequelizeModule.forFeature([Card])],
  providers: [CardService, CardResolver],
})
export class CardsModule {}
