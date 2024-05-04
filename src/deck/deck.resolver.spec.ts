import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Card } from 'src/card/entities/card.entity';
import CardModelFactory from 'src/common/test-utils/card.model.factory';
import DeckCardModelFactory from 'src/common/test-utils/deck-card.model.factory';
import DeckModelFactory from 'src/common/test-utils/deck.model.factory';
import { DeckResolver } from './deck.resolver';
import { DeckService } from './deck.service';
import { CreateDeckInput } from './dto/create-deck.input';
import { FindAllDecksInput } from './dto/find-all-decks.input';
import { UpdateDeckInput } from './dto/update-deck.input';
import { DeckCard } from './entities/deck-card.entity';
import { Deck } from './entities/deck.entity';

describe('DeckResolver', () => {
  let resolver: DeckResolver;
  const DeckServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckResolver,
        {
          provide: DeckService,
          useValue: DeckServiceMock,
        },
        {
          provide: getModelToken(Deck),
          useValue: DeckModelFactory,
        },
        {
          provide: getModelToken(DeckCard),
          useValue: DeckCardModelFactory,
        },
        {
          provide: getModelToken(Card),
          useValue: CardModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<DeckResolver>(DeckResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createDeck', () => {
    it("should call deckService's create function", () => {
      const createDeckInput: CreateDeckInput = {
        format: 'standard',
        deckCards: [],
        name: 'My new deck',
      } as CreateDeckInput;
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const user = {
        id: 1,
      };

      resolver.createDeck(createDeckInput, attributes, user);

      expect(DeckServiceMock.create).toHaveBeenCalled();
      expect(DeckServiceMock.create).toHaveBeenCalledWith(
        { ...createDeckInput, userId: user.id },
        attributes,
      );
    });
  });

  describe('findAll', () => {
    it("should call deckService's findAll function", () => {
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const findAllDecksInput: FindAllDecksInput = {
        after: 'asdqwe',
        attributes,
      };
      const user = {
        id: 1,
      };

      resolver.findAll(findAllDecksInput, attributes, user);

      expect(DeckServiceMock.findAll).toHaveBeenCalled();
      expect(DeckServiceMock.findAll).toHaveBeenCalledWith({
        ...findAllDecksInput,
        userId: user.id,
        attributes,
      });
    });
  });

  describe('findOne', () => {
    it("should call deckService's findOne function", () => {
      const attributes = {
        fields: ['id'],
        relations: {},
      };
      const user = {
        id: 1,
      };

      resolver.findOne(123, attributes, user);

      expect(DeckServiceMock.findOne).toHaveBeenCalled();
      expect(DeckServiceMock.findOne).toHaveBeenCalledWith({
        id: 123,
        userId: user.id,
        attributes,
      });
    });
  });

  describe('updateDeck', () => {
    it("should call deckService's update function", () => {
      const input: UpdateDeckInput = {
        id: 123,
        input: {
          format: 'gloryfinder',
          name: 'My new deck',
        },
      };
      const user = {
        id: 1,
      };

      resolver.updateDeck(input, user);

      expect(DeckServiceMock.update).toHaveBeenCalled();
      expect(DeckServiceMock.update).toHaveBeenCalledWith({
        ...input,
        userId: user.id,
      });
    });
  });

  describe('removeDeck', () => {
    it("should call deckService's remove function", () => {
      const user = {
        id: 1,
      };

      resolver.removeDeck(321, user);

      expect(DeckServiceMock.remove).toHaveBeenCalled();
      expect(DeckServiceMock.remove).toHaveBeenCalledWith({
        id: 321,
        userId: user.id,
      });
    });
  });
});
