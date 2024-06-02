import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import CollectionCardModelFactory from 'src/common/test-utils/collection-card.model.factory';
import CollectionModelFactory from 'src/common/test-utils/collection.model.factory';
import { CollectionsService } from './collections.service';
import { CreateOrUpdateCollectionInput } from './dto/create-or-update-collection.input';
import { CollectionCard } from './entities/collection-card.entity';
import { Collection } from './entities/collection.entity';

describe('CollectionsService', () => {
  let service: CollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<CollectionsService>(CollectionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('creates a collection', async () => {
      const attributes = {
        fields: [],
        relations: { cards: { fields: ['id'], relations: {} } },
      };
      const collectionData: CreateOrUpdateCollectionInput = {
        userId: 1,
        cardsToAdd: [
          {
            cardId: 1,
          },
        ],
      };

      CollectionModelFactory.create.mockImplementationOnce(() => {
        return {
          id: 1,
          userId: 1,
        };
      });
      CollectionModelFactory.findOne.mockImplementationOnce(() => {
        return null;
      });

      await service.createOrUpdate(collectionData, attributes);
      expect(CollectionModelFactory.create).toHaveBeenCalled();
      expect(CollectionModelFactory.create).toHaveBeenCalledWith({
        userId: collectionData.userId,
      });
    });

    it('adds cards to a collection', async () => {
      const attributes = {
        fields: [],
        relations: { cards: { fields: ['id'], relations: {} } },
      };
      const collectionData: CreateOrUpdateCollectionInput = {
        userId: 1,
        cardsToAdd: [
          {
            cardId: 1,
          },
        ],
      };
      const { cardsToAdd } = collectionData;

      CollectionModelFactory.create.mockImplementationOnce(() => {
        return {
          id: 1,
          userId: 1,
        };
      });
      CollectionModelFactory.findOne.mockImplementationOnce(() => {
        return { id: 1 };
      });

      await service.createOrUpdate(collectionData, attributes);
      expect(CollectionCardModelFactory.bulkCreate).toHaveBeenCalled();
      expect(CollectionCardModelFactory.bulkCreate).toHaveBeenCalledWith(
        cardsToAdd,
      );
    });

    it('removes cards from a collection', async () => {
      const attributes = {
        fields: [],
        relations: { cards: { fields: ['id'], relations: {} } },
      };
      const collectionData: CreateOrUpdateCollectionInput = {
        userId: 1,
        cardsToRemove: [
          {
            cardId: 1,
          },
        ],
      };

      CollectionModelFactory.create.mockImplementationOnce(() => {
        return {
          id: 1,
          userId: 1,
        };
      });
      CollectionModelFactory.findOne.mockImplementationOnce(() => {
        return { id: 1 };
      });

      await service.createOrUpdate(collectionData, attributes);
      expect(CollectionCardModelFactory.destroy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('finds a collection', async () => {
      const attributes = {
        fields: [],
        relations: { cards: { fields: ['id'], relations: {} } },
      };

      CollectionModelFactory.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          userId: 1,
        };
      });

      await service.findOne({ userId: 1, attributes });
      expect(CollectionModelFactory.findOne).toHaveBeenCalled();
    });

    it('returns a new collection if none is found', async () => {
      const attributes = {
        fields: [],
        relations: { cards: { fields: ['id'], relations: {} } },
      };

      CollectionModelFactory.findOne.mockImplementationOnce(() => {
        return null;
      });

      const collectionReturned = await service.findOne({
        userId: 1,
        attributes,
      });
      expect(CollectionModelFactory.findOne).toHaveBeenCalled();
      expect(collectionReturned.cards).toStrictEqual([]);
    });
  });
});
