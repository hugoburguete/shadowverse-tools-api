import { GraphQLError, GraphQLErrorOptions } from 'graphql';

export class ResourceNotFoundError extends GraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    options.extensions.code = 'RESOURCE_NOT_FOUND';
    super(message, options);
  }
}
