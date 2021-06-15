import { loader } from 'graphql.macro';

export * from './types/DeleteGame';

export const DELETE_GAME = loader('./query.gql');
