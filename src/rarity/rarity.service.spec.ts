import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import rarityModelFactory from 'src/common/test-utils/rarity.model.factory';
import { FindAllRaritiesArgs } from './dto/find-all-rarities.args';
import { Rarity } from './entities/rarity.entity';
import { RarityService } from './rarity.service';

describe('RarityService', () => {
  let service: RarityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RarityService,
        {
          provide: getModelToken(Rarity),
          useValue: rarityModelFactory,
        },
      ],
    }).compile();

    service = module.get<RarityService>(RarityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all expansions', async () => {
      const args = new FindAllRaritiesArgs();
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll(args);
      expect(result.length).toBe(2);
    });
  });
});
