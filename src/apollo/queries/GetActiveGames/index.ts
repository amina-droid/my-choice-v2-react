import { loader } from 'graphql.macro';

export * from './types/GetActiveGames';

export const GET_ACTIVE_GAMES = loader('./query.gql');
