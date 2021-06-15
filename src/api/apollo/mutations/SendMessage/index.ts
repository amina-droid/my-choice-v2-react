import { loader } from 'graphql.macro';

export * from './types/SendMessage';

export const SEND_MESSAGE = loader('./query.gql');
