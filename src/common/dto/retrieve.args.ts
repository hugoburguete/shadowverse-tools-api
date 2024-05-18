import { ArgsType } from '@nestjs/graphql';
import { ParsedField } from '../../common/decorators/fields.decorator';

@ArgsType()
export abstract class RetrieveArgs {
  attributes: ParsedField;
}
