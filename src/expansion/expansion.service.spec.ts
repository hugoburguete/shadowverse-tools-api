import { Test, TestingModule } from '@nestjs/testing';
import { ExpansionService } from './expansion.service';

describe('ExpansionService', () => {
  let service: ExpansionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpansionService],
    }).compile();

    service = module.get<ExpansionService>(ExpansionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
