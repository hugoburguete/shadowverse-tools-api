import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/interfaces/paginated.interface';
import { Deck } from './deck.entity';

@ObjectType({ description: 'Paginated fetch result for decks.' })
export class PaginatedDecks extends Paginated(Deck, 'Deck') {}
