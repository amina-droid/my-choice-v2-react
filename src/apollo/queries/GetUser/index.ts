import { loader } from 'graphql.macro';

export * from './types/GetUser';

export const GET_USER = loader('./query.gql');
