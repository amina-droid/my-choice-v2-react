import { loader } from 'graphql.macro';

export * from './types/GameUser';

export const GAME_USER = loader('./fragment.gql');
