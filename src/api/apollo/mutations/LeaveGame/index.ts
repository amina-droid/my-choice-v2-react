import { loader } from 'graphql.macro';

export * from './types/LeaveGame';

export const LEAVE_GAME = loader('./query.gql');
