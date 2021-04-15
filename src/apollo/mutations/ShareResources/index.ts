import { loader } from 'graphql.macro';

export * from './types/ShareResources';

export const SHARE_RESOURCES = loader('./query.gql');
