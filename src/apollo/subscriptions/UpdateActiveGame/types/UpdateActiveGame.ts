/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlayerPosition, PlayerStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL subscription operation: UpdateActiveGame
// ====================================================

export interface UpdateActiveGame_updateActiveGame_players_resources {
  __typename: "Resources";
  lives: number | null;
  white: number | null;
  dark: number | null;
  money: number | null;
}

export interface UpdateActiveGame_updateActiveGame_players {
  __typename: "Player";
  _id: any;
  nickname: string;
  position: PlayerPosition | null;
  status: PlayerStatus;
  resources: UpdateActiveGame_updateActiveGame_players_resources | null;
  hold: number | null;
  avatar: string | null;
}

export interface UpdateActiveGame_updateActiveGame {
  __typename: "GameSession";
  _id: any;
  name: string;
  observers: number;
  players: UpdateActiveGame_updateActiveGame_players[];
}

export interface UpdateActiveGame {
  updateActiveGame: UpdateActiveGame_updateActiveGame;
}

export interface UpdateActiveGameVariables {
  gameId: any;
}
