import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/entities/card.entity';
import { Collection } from './collection.entity';

@ObjectType()
@Table({ tableName: 'collection_cards' })
export class CollectionCard extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id?: number;

  // Card association
  @Field(() => Int)
  @ForeignKey(() => Card)
  @Column
  cardId: number;

  @BelongsTo(() => Card)
  card?: Card;

  // Deck association
  @ForeignKey(() => Collection)
  @Column
  collectionId?: number;

  @BelongsTo(() => Collection)
  collection?: Collection;
}
