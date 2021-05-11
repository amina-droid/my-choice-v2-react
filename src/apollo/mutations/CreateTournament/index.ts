import { loader } from 'graphql.macro';

export * from './types/CreateTournament';

export const CREATE_TOURNAMENT = loader('./query.gql');
