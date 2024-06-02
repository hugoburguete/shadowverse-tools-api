import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/card/entities/card.entity';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { CollectionCard } from './entities/collection-card.entity';
import { Collection } from './entities/collection.entity';

@Module({
  imports: [SequelizeModule.forFeature([Card, Collection, CollectionCard])],
  providers: [CollectionsResolver, CollectionsService],
})
export class CollectionsModule {}
