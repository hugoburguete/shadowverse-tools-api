import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import expansionModelFactory from 'src/common/test-utils/expansion.model.factory';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { ExpansionService } from './expansion.service';

describe('ExpansionService', () => {
  let service: ExpansionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpansionService,
        {
          provide: getModelToken(Expansion),
          useValue: expansionModelFactory,
        },
      ],
    }).compile();

    service = module.get<ExpansionService>(ExpansionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all expansions', async () => {
      const args = new FindAllExpansionsArgs();
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll(args);
      expect(result.length).toBe(2);
    });

    it('should return a result with filtered expansions', async () => {
      const args = new FindAllExpansionsArgs();
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      args.ids = [1];
      const result = await service.findAll(args);
      expect(result.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return the queried expansion', async () => {
      const expansionId = 1;
      const result = await service.findOne(expansionId);

      expect(result.id).toStrictEqual(expansionId);
    });

    it('should return the queried expansion', async () => {
      const expansionId = 3;
      const result = await service.findOne(expansionId);
      expect(result).toBe(null);
    });
  });
});
