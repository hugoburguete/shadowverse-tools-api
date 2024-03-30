import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Expansion } from './entities/expansion.entity';
import { ExpansionResolver } from './expansion.resolver';
import { ExpansionService } from './expansion.service';

describe('ExpansionResolver', () => {
  let resolver: ExpansionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forFeature([Expansion])],
      providers: [ExpansionResolver, ExpansionService],
    }).compile();

    resolver = module.get<ExpansionResolver>(ExpansionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
