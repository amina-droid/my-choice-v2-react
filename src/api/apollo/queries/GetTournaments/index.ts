import { loader } from 'graphql.macro';

export * from './types/GetTournaments';

export const GET_TOURNAMENTS = loader('./query.gql');
