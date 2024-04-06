import { ArgsType } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/base/dto/retrieve.args';

@ArgsType()
export class FindAllRaritiesArgs extends RetrieveArgs {}
