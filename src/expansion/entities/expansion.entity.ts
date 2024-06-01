import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Card } from '../../card/entities/card.entity';

@ObjectType()
@Table({ timestamps: false, tableName: 'expansions' })
export class Expansion extends Model {
  @Field(() => Int, { description: 'The expansion identifier.' })
  @Column({ primaryKey: true })
  id: number;

  @Field(() => String, { description: 'The expansion slug.' })
  @Column
  slug: string;

  @Field(() => String, { description: 'The expansion name.' })
  @Column
  name: string;

  @Field(() => GraphQLISODateTime, {
    description: 'The date the expansion was released.',
  })
  @Column
  releaseDate: Date;

  @Field(() => [Card], {
    description: 'The cards within this expansion.',
  })
  @HasMany(() => Card)
  cards: Card[];
}
