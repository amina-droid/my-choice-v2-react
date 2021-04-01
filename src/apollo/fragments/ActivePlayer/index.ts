import { loader } from 'graphql.macro';

export * from './types/ActivePlayer';

export const ACTIVE_PLAYER = loader('./fragment.gql');
