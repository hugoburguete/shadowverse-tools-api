import { Test, TestingModule } from '@nestjs/testing';
import { DeckResolver } from './deck.resolver';
import { DeckService } from './deck.service';

describe('DeckResolver', () => {
  let resolver: DeckResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeckResolver, DeckService],
    }).compile();

    resolver = module.get<DeckResolver>(DeckResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
