import { loader } from 'graphql.macro';

export * from './types/GetUserStatistic';

export const GET_USER_STATISTIC = loader('./query.gql');
