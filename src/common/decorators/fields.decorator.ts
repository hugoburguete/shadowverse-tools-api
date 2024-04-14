import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
} from 'graphql-parse-resolve-info';

export const fieldsFactory = (_data: unknown, appCtx: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(appCtx);
  const info = ctx.getInfo();

  const parsed = parseResolveInfo(info) as ResolveTree;
  return parseFieldsByTypename(parsed.fieldsByTypeName);
};

/**
 * Decorator that parses the fields requested from a GQL request into a more
 * easy to manage structure.
 */
export const Fields = () => {
  return createParamDecorator<unknown, ExecutionContext>(fieldsFactory)();
};

export type ParsedField<T = string> = {
  fields: T[];
  relations: Record<string, ParsedField>;
};

export const parseFieldsByTypename = (
  fieldsByTypeName: FieldsByTypeName,
): ParsedField => {
  const fields = fieldsByTypeName[Object.keys(fieldsByTypeName)[0]];
  const fieldNames = Object.keys(fields)
    .filter((fieldKey) => {
      return (
        fields[fieldKey].fieldsByTypeName &&
        Object.keys(fields[fieldKey].fieldsByTypeName).length === 0
      );
    })
    .map((fieldKey) => fields[fieldKey].name);

  const fieldsWithRelations = Object.keys(fields).filter((fieldKey) => {
    return (
      fields[fieldKey].fieldsByTypeName &&
      Object.keys(fields[fieldKey].fieldsByTypeName).length !== 0
    );
  });
  const relations = {};

  for (let i = 0; i < fieldsWithRelations.length; i++) {
    const relationName = fieldsWithRelations[i];
    const fieldRelation = fields[fieldsWithRelations[i]];
    relations[relationName] = parseFieldsByTypename(
      fieldRelation.fieldsByTypeName,
    );
  }

  return {
    fields: fieldNames,
    relations: relations,
  };
};
