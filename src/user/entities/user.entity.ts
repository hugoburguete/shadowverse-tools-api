import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@ObjectType()
@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  @Field(() => Int)
  id: number;

  @Column
  @Field(() => String)
  email: string;

  @Column
  @Field(() => String)
  password: string;

  @Column
  @Field(() => String)
  firstname: string;

  @Column
  @Field(() => String)
  lastname: string;
}
