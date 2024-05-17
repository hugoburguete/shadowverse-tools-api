import { UserInputError } from '@nestjs/apollo';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Card, CardType } from 'src/card/entities/card.entity';
import CardModelFactory from 'src/common/test-utils/card.model.factory';
import { DeckCardInput } from '../dto/deck-card.input';
import { DeckFormat } from '../entities/deck.entity';
import { DeckValidationPipe } from './deck-validation.pipe';

describe('DeckValidationPipe', () => {
  let pipe: DeckValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckValidationPipe,
        {
          provide: getModelToken(Card),
          useValue: CardModelFactory,
        },
      ],
    }).compile();

    pipe = module.get<DeckValidationPipe>(DeckValidationPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should not fail if it meets requirements for standard format', async () => {
      CardModelFactory.findAll.mockImplementationOnce((): Partial<Card>[] => {
        const mainDeck = [];
        for (let i = 0; i < 40; i++) {
          mainDeck.push({
            id: i,
            cardId: `BP01-${i}`,
            class: {
              slug: 'forestcraft',
            },
            type: CardType.FOLLOWER,
          });
        }
        const evolveDeck = [];
        for (let i = 0; i < 10; i++) {
          evolveDeck.push({
            id: 40 + i,
            cardId: `BP01-${40 + i}`,
            type: CardType.FOLLOWER_EVOLVE,
            class: {
              slug: 'forestcraft',
            },
          });
        }

        const leaderCard = {
          id: 50,
          cardId: `BP01-51`,
          type: CardType.LEADER,
          class: {
            slug: 'forestcraft',
          },
        };
        return [...mainDeck, ...evolveDeck, leaderCard].map((card) => {
          card.toJSON = () => card;
          return card;
        });
      });
      const format = DeckFormat.STANDARD;
      const name = 'My new deck';
      const userId = 1;
      const deckCards: DeckCardInput[] = [];
      for (let i = 0; i <= 51; i++) {
        deckCards.push({
          cardId: i,
          deckId: 1,
          quantity: 1,
        });
      }

      const deck = { format, name, deckCards, userId };

      expect(await pipe.transform(deck)).toStrictEqual(deck);
    });

    it("should not fail if there's no leader card for standard format", async () => {
      CardModelFactory.findAll.mockImplementationOnce((): Partial<Card>[] => {
        const mainDeck = [];
        for (let i = 0; i < 40; i++) {
          mainDeck.push({
            id: i,
            cardId: `BP01-${i}`,
            class: {
              slug: 'forestcraft',
            },
            type: CardType.FOLLOWER,
          });
        }
        const evolveDeck = [];
        for (let i = 0; i < 10; i++) {
          evolveDeck.push({
            id: 40 + i,
            cardId: `BP01-${40 + i}`,
            type: CardType.FOLLOWER_EVOLVE,
            class: {
              slug: 'forestcraft',
            },
          });
        }

        return [...mainDeck, ...evolveDeck].map((card) => {
          card.toJSON = () => card;
          return card;
        });
      });
      const format = 'standard';
      const name = 'My new deck';
      const userId = 1;
      const deckCards: DeckCardInput[] = [];
      for (let i = 0; i < 50; i++) {
        deckCards.push({ cardId: i, deckId: 1, quantity: 1 });
      }

      await expect(
        pipe.transform({ format, name, deckCards, userId }),
      ).rejects.toThrow(UserInputError);
    });
  });
});
