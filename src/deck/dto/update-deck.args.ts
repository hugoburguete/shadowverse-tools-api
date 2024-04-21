import { ArgsType } from '@nestjs/graphql';
import { UpdateDeckInput } from './update-deck.input';

@ArgsType()
export class UpdateDeckArgs extends UpdateDeckInput {
  id: number;
  userId: number;
}
