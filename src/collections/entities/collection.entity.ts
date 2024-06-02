import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { CollectionCard } from './collection-card.entity';

@ObjectType()
@Table({ tableName: 'collections' })
export class Collection extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @BelongsToMany(() => Card, () => CollectionCard, 'collectionId')
  @Field(() => [Card], { description: 'The cards this collection contains.' })
  cards: Card[] = [];

  // User association
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
