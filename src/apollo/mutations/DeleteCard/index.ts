import { loader } from 'graphql.macro';

export * from './types/DeleteCard';

export const DELETE_CARD = loader('./query.gql');
