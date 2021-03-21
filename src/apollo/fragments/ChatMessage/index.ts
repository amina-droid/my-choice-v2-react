import { loader } from 'graphql.macro';

export * from './types/ChatMessage';

export const ACTIVE_GAME_FRAGMENT = loader('./fragment.gql');
