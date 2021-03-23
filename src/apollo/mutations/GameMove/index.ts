import { loader } from 'graphql.macro';

export * from './types/GameMove';

export const GAME_MOVE = loader('./query.gql');
