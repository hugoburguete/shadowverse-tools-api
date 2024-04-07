import { ArgsType } from '@nestjs/graphql';
import { ParsedField } from 'src/utils/graphql/decorators/fields.decorator';

@ArgsType()
export class FindAllClassesArgs {
  attributes: ParsedField;
}
