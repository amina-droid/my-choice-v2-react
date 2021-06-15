import { loader } from 'graphql.macro';

export * from './types/OnDroppedCard';

export const ON_DROPPED_CARD = loader('./query.gql');
