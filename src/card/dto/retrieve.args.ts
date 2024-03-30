import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ExpansionAttributes } from 'src/expansion/dto/fetch.args';
import { Card } from '../entities/card.entities';

@ArgsType()
export abstract class RetrieveArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  attributes: CardAttributes[];
}

export type CardFields = keyof Card | 'expansion';

export type CardAttributes = {
  name: CardFields;
  children: ExpansionAttributes[];
};
