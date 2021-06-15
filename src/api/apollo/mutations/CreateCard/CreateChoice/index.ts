import { loader } from 'graphql.macro';

export * from './types/CreateChoice';

export const CREATE_CHOICE = loader('./query.gql');
