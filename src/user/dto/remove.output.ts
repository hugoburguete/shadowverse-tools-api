import { Field, ObjectType } from '@nestjs/graphql';

export const REMOVE_STATUS_SUCCESS = 'success';
export const REMOVE_STATUS_ERROR = 'error';
export type RemoveStatusType =
  | typeof REMOVE_STATUS_SUCCESS
  | typeof REMOVE_STATUS_ERROR;

@ObjectType()
export abstract class RemoveOutput {
  @Field(() => String)
  status: RemoveStatusType;
}
