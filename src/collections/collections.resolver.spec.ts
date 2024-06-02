import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import CollectionCardModelFactory from 'src/common/test-utils/collection-card.model.factory';
import CollectionModelFactory from 'src/common/test-utils/collection.model.factory';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { CollectionCard } from './entities/collection-card.entity';
import { Collection } from './entities/collection.entity';

describe('CollectionsResolver', () => {
  let resolver: CollectionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsResolver,
        CollectionsService,
        {
          provide: getModelToken(Collection),
          useValue: CollectionModelFactory,
        },
        {
          provide: getModelToken(CollectionCard),
          useValue: CollectionCardModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<CollectionsResolver>(CollectionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
