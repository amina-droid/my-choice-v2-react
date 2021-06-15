import { loader } from 'graphql.macro';

export * from './types/StartGame';

export const START_GAME = loader('./query.gql');
