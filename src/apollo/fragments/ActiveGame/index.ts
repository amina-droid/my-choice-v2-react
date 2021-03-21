import { loader } from 'graphql.macro';

export * from './types/ActiveGame';

export const ACTIVE_GAME = loader('./fragment.gql');
