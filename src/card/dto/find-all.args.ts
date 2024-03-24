import { ArgsType } from '@nestjs/graphql';
import { RetrievingArgs } from './retrieving.arts';

@ArgsType()
export class FindAllCardsArgs extends RetrievingArgs {}
