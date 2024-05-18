import { ArgsType } from '@nestjs/graphql';
import { PaginatedRetrieveArgs } from '../../common/dto/paginated-retrieve.args';

@ArgsType()
export class FindAllClassesArgs extends PaginatedRetrieveArgs {}
