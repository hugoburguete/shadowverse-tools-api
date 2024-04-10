import { GqlExecutionContext } from '@nestjs/graphql';
import * as GraphQLParseResolveInfo from 'graphql-parse-resolve-info';
import { fieldsFactory, parseFieldsByTypename } from './fields.decorator';

jest.mock('@nestjs/graphql');
jest.mock('graphql-parse-resolve-info');

describe('Field decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockGraphQLContext: Pick<GqlExecutionContext, 'getInfo'> = {
      getInfo: jest.fn(),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as GqlExecutionContext);
  });

  it('Parses fields', () => {
    const data = {
      name: 'getCards',
      alias: 'getCards',
      args: {},
      fieldsByTypeName: {
        Card: {
          cardId: {
            name: 'cardId',
            alias: 'cardId',
            args: {},
            fieldsByTypeName: {},
          },
        },
      },
    } as GraphQLParseResolveInfo.ResolveTree;

    // Assume the parser will always return the value it claims to.
    jest
      .spyOn(GraphQLParseResolveInfo, 'parseResolveInfo')
      .mockReturnValue(data);
    fieldsFactory(null, null);

    const parsed = parseFieldsByTypename(data.fieldsByTypeName);
    expect(parsed.fields).toStrictEqual(['cardId']);
  });

  it('Parses relations', () => {
    const data = {
      name: 'getCards',
      alias: 'getCards',
      args: {},
      fieldsByTypeName: {
        Card: {
          expansion: {
            name: 'expansion',
            alias: 'expansion',
            args: {},
            fieldsByTypeName: {
              Expansion: {
                name: {
                  name: 'name',
                  alias: 'name',
                  args: {},
                  fieldsByTypeName: {},
                },
              },
            },
          },
        },
      },
    } as GraphQLParseResolveInfo.ResolveTree;

    jest
      .spyOn(GraphQLParseResolveInfo, 'parseResolveInfo')
      .mockReturnValue(data);
    fieldsFactory(null, null);

    const parsed = parseFieldsByTypename(data.fieldsByTypeName);
    expect(parsed.fields).toStrictEqual([]);
    expect(parsed.relations).toStrictEqual({
      expansion: {
        fields: ['name'],
        relations: {},
      },
    });
  });
});
