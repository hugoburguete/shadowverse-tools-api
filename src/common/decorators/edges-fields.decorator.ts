import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ParsedField, fieldsFactory } from './fields.decorator';

export const edgesFieldsFactory = (data: unknown, appCtx: ExecutionContext) => {
  return getFieldsForEdges(fieldsFactory(data, appCtx));
};

/**
 * Decorator that parses the edges fields requested from a GQL request into a
 * more easy to manage structure.
 */
export const EdgesFields = () => {
  return createParamDecorator<unknown, ExecutionContext>(edgesFieldsFactory)();
};

export const getFieldsForEdges = <T = string>(parsedFields: ParsedField<T>) => {
  return (
    parsedFields.relations['edges']?.relations['node'] || {
      fields: ['id'],
      relations: {},
    }
  );
};
