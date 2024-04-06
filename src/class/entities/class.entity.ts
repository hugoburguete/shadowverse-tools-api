import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';

@ObjectType()
@Table({ timestamps: false, tableName: 'classes' })
export class Class extends Model {
  @Field(() => Int, { description: 'The class identifier.' })
  @Column({ primaryKey: true })
  id: number;

  @Field(() => String, { description: 'The class slug.' })
  @Column
  slug: string;

  @Field(() => String, { description: 'The class name.' })
  @Column
  name: string;

  @Field(() => [Card], {
    description: 'The cards within this class.',
  })
  @HasMany(() => Card)
  cards: Card[];
}
