import { loader } from 'graphql.macro';

export * from './types/AuthVK';

export const AUTH_VK = loader('./query.gql');
