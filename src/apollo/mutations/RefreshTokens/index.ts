import { loader } from 'graphql.macro';

export * from './types/RefreshTokens';

export const REFRESH_TOKENS = loader('./query.gql');
