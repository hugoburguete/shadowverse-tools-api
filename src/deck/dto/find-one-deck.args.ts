import { ArgsType } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/common/dto/retrieve.args';

@ArgsType()
export class FindOneDeckArgs extends RetrieveArgs {
  id: number;
  userId: number;
}
