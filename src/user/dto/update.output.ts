import { Field, ObjectType } from '@nestjs/graphql';

export const UPDATE_STATUS_SUCCESS = 'success';
export const UPDATE_STATUS_ERROR = 'error';
export type UpdateStatusType =
  | typeof UPDATE_STATUS_SUCCESS
  | typeof UPDATE_STATUS_ERROR;

@ObjectType()
export abstract class UpdateOutput {
  @Field(() => String)
  status: UpdateStatusType;
}
