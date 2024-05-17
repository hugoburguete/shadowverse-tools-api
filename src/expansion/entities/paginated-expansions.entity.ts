import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/interfaces/paginated.interface';
import { Expansion } from './expansion.entity';

@ObjectType({ description: 'Result for filtered expansions.' })
export class PaginatedExpansions extends Paginated(Expansion, 'Expansion') {}
