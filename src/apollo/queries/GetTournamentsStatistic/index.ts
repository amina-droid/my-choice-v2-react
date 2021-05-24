import { loader } from 'graphql.macro';

export * from './types/GetTournamentsStatistic';

export const GET_TOURNAMENTS_STATISTIC = loader('./query.gql');
