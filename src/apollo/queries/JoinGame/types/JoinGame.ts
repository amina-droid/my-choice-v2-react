/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStatus, PlayerPosition, PlayerStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: JoinGame
// ====================================================

export interface JoinGame_joinGame_players_resources {
  __typename: "Resources";
  lives: number | null;
  white: number | null;
  dark: number | null;
  money: number | null;
}

export interface JoinGame_joinGame_players {
  __typename: "Player";
  _id: any;
  nickname: string;
  position: PlayerPosition | null;
  status: PlayerStatus;
  dream: number | null;
  resources: JoinGame_joinGame_players_resources | null;
  hold: number | null;
  avatar: string | null;
}

export interface JoinGame_joinGame {
  __typename: "GameSession";
  _id: any;
  name: string;
  observers: number;
  creator: any;
  status: GameStatus;
  players: JoinGame_joinGame_players[];
}

export interface JoinGame {
  joinGame: JoinGame_joinGame;
}

export interface JoinGameVariables {
  gameId: any;
}
