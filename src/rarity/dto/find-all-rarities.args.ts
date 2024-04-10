import { ArgsType } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/common/dto/retrieve.args';

@ArgsType()
export class FindAllRaritiesArgs extends RetrieveArgs {}
