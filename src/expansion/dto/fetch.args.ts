import { ArgsType, Field, Int } from '@nestjs/graphql';
import { CardAttributes } from 'src/card/dto/retrieve.args';
import { Expansion } from '../entities/expansion.entity';

@ArgsType()
export abstract class FetchArgs {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  take = 1;

  attributes: ExpansionAttributes[];
}

export type ExpansionFields = keyof Expansion;

export type ExpansionAttributes = {
  name: ExpansionFields;
  children: CardAttributes[];
};
