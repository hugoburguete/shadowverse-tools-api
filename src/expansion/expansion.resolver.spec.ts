import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import expansionModelFactory from 'src/utils/test/expansion.model.factory';
import { FindAllExpansionsArgs } from './dto/find-all-expansions.args';
import { Expansion } from './entities/expansion.entity';
import { ExpansionResolver } from './expansion.resolver';
import { ExpansionService } from './expansion.service';

describe('ExpansionResolver', () => {
  let resolver: ExpansionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpansionResolver,
        ExpansionService,
        {
          provide: getModelToken(Expansion),
          useValue: expansionModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<ExpansionResolver>(ExpansionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all expansions', async () => {
      const args = new FindAllExpansionsArgs();
      const result = await resolver.findAll(args, {
        fields: ['id'],
        relations: {},
      });
      expect(result.length).toBe(2);
    });

    it('should return a result with filtered expansions', async () => {
      const args = new FindAllExpansionsArgs();
      args.ids = [1];
      const result = await resolver.findAll(args, {
        fields: ['id'],
        relations: {},
      });
      expect(result.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return the queried expansion', async () => {
      const expansionId = 1;
      const result = await resolver.findOne(expansionId);

      expect(result.id).toStrictEqual(expansionId);
    });

    it('should fail if no expansion is found', async () => {
      const expansionId = 3;
      const t = async () => {
        await resolver.findOne(expansionId);
      };
      expect(t).rejects.toThrow(NotFoundException);
    });
  });
});
