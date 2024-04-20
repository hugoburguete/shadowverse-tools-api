import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { Deck } from './deck.entity';

@ObjectType({ description: 'Result for user decks.' })
export class PaginatedDecks extends Paginated(Deck, 'Deck') {}
