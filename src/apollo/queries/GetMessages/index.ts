import { loader } from 'graphql.macro';

export * from './types/GetMessages';

export const GET_MESSAGES = loader('./query.gql');
