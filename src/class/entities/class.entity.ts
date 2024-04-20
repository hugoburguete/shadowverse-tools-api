import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@ObjectType()
@Table({ timestamps: false, tableName: 'classes' })
export class Class extends Model {
  @Field(() => Int, { description: 'The class identifier.' })
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Field(() => String, { description: 'The class slug.' })
  @Column
  slug: string;

  @Field(() => String, { description: 'The class name.' })
  @Column
  name: string;
}
