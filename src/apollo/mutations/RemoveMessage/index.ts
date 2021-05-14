import { loader } from 'graphql.macro';

export * from './types/RemoveMessage';

export const REMOVE_MESSAGE = loader('./query.gql');
