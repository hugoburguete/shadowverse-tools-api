import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import CardModelFactory from 'src/utils/test/card.model.factory';
import { CardService } from './card.service';
import { FindAllCardsArgs } from './dto/find-all-cards.args';
import { Card } from './entities/card.entity';

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getModelToken(Card),
          useValue: CardModelFactory,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const args = new FindAllCardsArgs();
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll(args);
      expect(result.length).toBe(2);
    });

    it('should return a result with filtered cards', async () => {
      const args = new FindAllCardsArgs();
      args.searchTerm = 'asd';
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll(args);
      expect(result.length).toBe(1);
    });
  });
});
