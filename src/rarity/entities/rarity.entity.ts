import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Card } from '../../card/entities/card.entity';

@ObjectType()
@Table({ timestamps: false })
export class Rarity extends Model<Rarity> {
  @Field(() => Int, { description: 'The rarity identifier.' })
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Field(() => String, { description: 'The rarity name.' })
  @Column
  name: string;

  @Field(() => String, { description: 'The rarity acronym.' })
  @Column
  acronym: string;

  @HasMany(() => Card)
  cards: Card[];
}
