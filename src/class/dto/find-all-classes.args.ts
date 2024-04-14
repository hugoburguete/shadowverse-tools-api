import { ArgsType } from '@nestjs/graphql';
import { PaginatedRetrieveArgs } from 'src/common/dto/paginated-retrieve.args';

@ArgsType()
export class FindAllClassesArgs extends PaginatedRetrieveArgs {}
