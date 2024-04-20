import { ArgsType } from '@nestjs/graphql';
import { FindAllDecksInput } from './find-all-decks.input';

@ArgsType()
export class FindAllDecksArgs extends FindAllDecksInput {
  userId: number;
}
