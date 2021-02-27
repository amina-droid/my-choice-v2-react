import { loader } from 'graphql.macro';

export * from './types/CreateGame';

export const CREATE_GAME = loader('./query.gql');
