import { ArgsType } from '@nestjs/graphql';
import { ParsedField } from 'src/common/decorators/fields.decorator';

@ArgsType()
export class FindAllClassesArgs {
  attributes: ParsedField;
}
