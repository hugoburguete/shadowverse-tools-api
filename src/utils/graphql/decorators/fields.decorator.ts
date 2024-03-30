import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Kind, SelectionNode } from 'graphql';
import { GQLRequestFields } from '../types/fields.entity';

/**
 * Parses the fields requested from a GQL request into a more easily manageable
 * array.
 */
export const Fields = <T extends string, U>() => {
  return createParamDecorator<
    unknown,
    ExecutionContext,
    GQLRequestFields<T, U>[]
  >((_data: unknown, appCtx: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(appCtx);
    const info = ctx.getInfo();

    return parseSelections<T, U>(info.fieldNodes[0].selectionSet.selections);
  })();
};

/**
 * Simple parser that retrieve all fields requested from a GQL request.
 *
 * @param selections
 * @returns
 */
const parseSelections = <T extends string, U>(
  selections: readonly SelectionNode[],
): GQLRequestFields<T, U>[] => {
  return selections
    .map((item) => {
      if (item.kind === Kind.FIELD) {
        const struct = {
          name: item.name.value as T,
          children: [],
        };

        if (item.selectionSet) {
          struct.children = parseSelections(
            item.selectionSet.selections,
          ) as U[];
        }
        return struct;
      }
      return null;
    })
    .filter((s) => s !== null);
};
