import { ArgsType } from '@nestjs/graphql';
import { RetrieveArgs } from '../../common/dto/retrieve.args';

@ArgsType()
export class FindOneDeckArgs extends RetrieveArgs {
  id: number;
}
