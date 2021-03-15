import { loader } from 'graphql.macro';

export * from './types/GetCards';

export const GET_CARDS = loader('./query.gql');
