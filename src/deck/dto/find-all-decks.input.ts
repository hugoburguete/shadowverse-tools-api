import { ArgsType } from '@nestjs/graphql';
import { PaginatedRetrieveArgs } from 'src/common/dto/paginated-retrieve.args';

@ArgsType()
export class FindAllDecksInput extends PaginatedRetrieveArgs {}
