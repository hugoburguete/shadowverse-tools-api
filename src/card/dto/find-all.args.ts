import { ArgsType } from '@nestjs/graphql';
import { RetrieveArgs } from './retrieve.args';

@ArgsType()
export class FindAllCardsArgs extends RetrieveArgs {}
