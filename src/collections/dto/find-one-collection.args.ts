import { InputType } from '@nestjs/graphql';
import { RetrieveArgs } from 'src/common/dto/retrieve.args';

@InputType()
export class FindOneCollectionArgs extends RetrieveArgs {
  userId: number;
}
