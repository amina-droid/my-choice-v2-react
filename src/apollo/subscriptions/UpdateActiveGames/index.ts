import { loader } from 'graphql.macro';

export * from './types/UpdateActiveGames';

export const UPDATE_ACTIVE_GAMES = loader('./query.gql');
