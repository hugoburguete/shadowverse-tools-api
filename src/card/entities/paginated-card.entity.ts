import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/interfaces/paginated.interface';
import { Card } from './card.entity';

@ObjectType({ description: 'Result for filtered cards.' })
export class PaginatedCards extends Paginated(Card, 'Card') {}
