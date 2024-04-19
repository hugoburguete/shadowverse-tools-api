import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@ObjectType()
@Table
export class User extends Model<User> {
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
  name: string;
}
