import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import rarityModelFactory from 'src/utils/test/rarity.model.factory';
import { FindAllRaritiesArgs } from './dto/find-all-rarities.args';
import { Rarity } from './entities/rarity.entity';
import { RarityResolver } from './rarity.resolver';
import { RarityService } from './rarity.service';

describe('RarityResolver', () => {
  let resolver: RarityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RarityResolver,
        RarityService,
        {
          provide: getModelToken(Rarity),
          useValue: rarityModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<RarityResolver>(RarityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all rarities', async () => {
      const args = new FindAllRaritiesArgs();
      const result = await resolver.findAll(args, {
        fields: ['id'],
        relations: {},
      });
      expect(result.length).toBe(2);
    });
  });
});
