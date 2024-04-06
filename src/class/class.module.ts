import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import { Class } from './entities/class.entity';

@Module({
  imports: [SequelizeModule.forFeature([Class, Card])],
  providers: [ClassResolver, ClassService, CardService],
})
export class ClassModule {}
