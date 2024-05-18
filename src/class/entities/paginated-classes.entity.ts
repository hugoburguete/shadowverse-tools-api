import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/interfaces/paginated.interface';
import { Class } from './class.entity';

@ObjectType({ description: 'Result for filtered classes.' })
export class PaginatedClasses extends Paginated(Class, 'Class') {}
