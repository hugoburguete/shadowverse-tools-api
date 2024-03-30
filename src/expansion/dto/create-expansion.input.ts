import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateExpansionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
