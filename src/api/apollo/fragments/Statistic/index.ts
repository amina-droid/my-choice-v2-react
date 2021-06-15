import { loader } from 'graphql.macro';

export * from './types/Statistic';

export const STATISTIC = loader('./fragment.gql');
