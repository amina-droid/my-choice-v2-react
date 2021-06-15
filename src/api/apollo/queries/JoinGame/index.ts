import { loader } from 'graphql.macro';

export * from './types/JoinGame';

export const JOIN_GAME = loader('./query.gql');
