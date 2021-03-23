import { loader } from 'graphql.macro';

export * from './types/Choice';

export const CHOICE = loader('./query.gql');
