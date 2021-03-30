import { loader } from 'graphql.macro';

export * from './types/NewCard';

export const NEW_CARD = loader('./fragment.gql');
