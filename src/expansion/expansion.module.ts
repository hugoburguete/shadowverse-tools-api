import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/card/entities/card.entities';
import { Expansion } from './entities/expansion.entity';
import { ExpansionResolver } from './expansion.resolver';
import { ExpansionService } from './expansion.service';

@Module({
  imports: [SequelizeModule.forFeature([Expansion, Card])],
  providers: [ExpansionResolver, ExpansionService],
})
export class ExpansionModule {}
