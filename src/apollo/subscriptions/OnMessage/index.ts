import { loader } from 'graphql.macro';

export * from './types/OnMessage';

export const ON_MESSAGE = loader('./query.gql');
