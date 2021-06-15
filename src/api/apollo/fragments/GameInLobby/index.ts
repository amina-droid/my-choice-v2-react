import { loader } from 'graphql.macro';

export * from './types/GameInLobby';

export const GAME_IN_LOBBY = loader('./fragment.gql');
