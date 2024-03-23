import { Module } from '@nestjs/common';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';

@Module({
  imports: [],
  providers: [CardService, CardResolver],
})
export class CardsModule {}
