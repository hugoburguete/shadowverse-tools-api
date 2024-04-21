import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import DeckCardModelFactory from 'src/common/test-utils/deck-card.model.factory';
import DeckModelFactory from 'src/common/test-utils/deck.model.factory';
import { DeckService } from './deck.service';
import { CreateDeckInput } from './dto/create-deck.input';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        {
          provide: getModelToken(Deck),
          useValue: DeckModelFactory,
        },
        {
          provide: getModelToken(DeckCard),
          useValue: DeckCardModelFactory,
        },
      ],
    }).compile();

    service = module.get<DeckService>(DeckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a deck', async () => {
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const deckData: CreateDeckInput = {
        format: 'standard',
        name: 'New deck',
        userId: 1,
        deckCards: [
          {
            cardId: 1,
            quantity: 1,
            deckId: 1,
          },
          {
            cardId: 1,
            quantity: 1,
            deckId: 1,
          },
        ],
      };
      const { deckCards, ...deckInfo } = deckData;

      DeckModelFactory.create.mockImplementationOnce(() => {
        return { id: 1 };
      });
      DeckModelFactory.findOne.mockImplementationOnce(() => {
        return { id: 1 };
      });

      await service.create(deckData, attributes);
      expect(DeckModelFactory.create).toHaveBeenCalled();
      expect(DeckModelFactory.create).toHaveBeenCalledWith(deckInfo);
      expect(DeckCardModelFactory.bulkCreate).toHaveBeenCalled();
      expect(DeckCardModelFactory.bulkCreate).toHaveBeenCalledWith(deckCards);
    });
  });

  describe('findAll', () => {
    it('return all decks', async () => {
      DeckModelFactory.findAll.mockImplementationOnce(() => {
        return [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ];
      });
      DeckModelFactory.count.mockImplementationOnce(() => {
        return 2;
      });
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll({
        userId: 1,
        attributes,
      });
      expect(DeckModelFactory.findAll).toHaveBeenCalled();
      expect(result.edges.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('returns a deck successfully.', async () => {
      DeckModelFactory.findOne.mockImplementationOnce(() => {
        return { id: 1 };
      });
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findOne({
        attributes,
        id: 1,
        userId: 1,
      });
      expect(DeckModelFactory.findOne).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('fails if no deck is found', async () => {
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      DeckModelFactory.findOne.mockImplementationOnce(() => {
        return null;
      });

      await expect(
        service.findOne({
          attributes,
          id: 1,
          userId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates a deck', async () => {
      DeckModelFactory.update.mockImplementationOnce(() => {
        return [1];
      });

      DeckModelFactory.findOne.mockImplementationOnce(() => {
        return { id: 1 };
      });
      const deckCards = [
        {
          cardId: 1,
          quantity: 1,
          deckId: 1,
        },
        {
          cardId: 1,
          quantity: 1,
          deckId: 1,
        },
      ];

      await service.update({
        id: 1,
        userId: 1,
        input: {
          format: 'standard',
          name: 'New deck 2',
          userId: 1,
          deckCards,
        },
      });
      expect(DeckModelFactory.update).toHaveBeenCalled();
      expect(DeckCardModelFactory.bulkCreate).toHaveBeenCalled();
      expect(DeckCardModelFactory.bulkCreate).toHaveBeenCalledWith(deckCards);
    });
  });
});
