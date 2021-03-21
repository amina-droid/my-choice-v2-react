import { loader } from 'graphql.macro';

export * from './types/UpdateActiveGame';

export const UPDATE_ACTIVE_GAME = loader('./query.gql');
