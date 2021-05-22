import { loader } from 'graphql.macro';

export * from './types/GetStatistic';

export const GET_STATISTIC = loader('./query.gql');
