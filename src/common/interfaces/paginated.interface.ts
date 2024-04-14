import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export type ICursor = string;

export interface IEdgeType<T> {
  cursor: ICursor;
  node: T;
}

export interface IPageInfoType {
  startCursor?: ICursor;
  endCursor?: ICursor;
  hasNextPage: boolean;
}

export interface IConnectedModel<T> {
  totalCount: number;
  edges: IEdgeType<T>[];
  pageInfo: IPageInfoType;
}

export function Paginated<T>(
  classRef: Type<T>,
  className: string,
): Type<IConnectedModel<T>> {
  @ObjectType(`${className}Edge`)
  abstract class EdgeType implements IEdgeType<T> {
    @Field(() => String)
    cursor: ICursor;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType('PageInfo')
  abstract class PageInfoType implements IPageInfoType {
    @Field(() => String, { nullable: true })
    startCursor?: ICursor;

    @Field(() => String, { nullable: true })
    endCursor?: ICursor;

    @Field()
    hasNextPage: boolean;
  }

  @ObjectType({ isAbstract: true })
  abstract class ConnectedModel implements IConnectedModel<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => Int)
    totalCount: number;

    @Field(() => PageInfoType, { nullable: true })
    pageInfo: PageInfoType;
  }

  return ConnectedModel as Type<IConnectedModel<T>>;
}
