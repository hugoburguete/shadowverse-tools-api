import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import CardModelFactory from 'src/utils/test/card.model.factory';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { Card } from './entities/card.entity';

describe('CardResolver', () => {
  let resolver: CardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardResolver,
        CardService,
        {
          provide: getModelToken(Card),
          useValue: CardModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<CardResolver>(CardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const args = new FindAllCardsArgs();
      const result = await resolver.findAll(args, {
        fields: ['id'],
        relations: {},
      });
      expect(result.length).toBe(2);
    });

    it('should return a result with filtered cards', async () => {
      const args = new FindAllCardsArgs();
      args.searchTerm = 'asd';
      const result = await resolver.findAll(args, {
        fields: ['id'],
        relations: {},
      });
      expect(result.length).toBe(1);
    });
  });
});
