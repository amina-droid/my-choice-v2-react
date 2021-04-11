/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GameStatus, PlayerPosition, UserSex } from "./../../../../types/globalTypes";

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
  disconnected: boolean | null;
  cell: number | null;
  dream: number | null;
  hold: number | null;
  gameover: boolean | null;
  avatar: string | null;
  sex: UserSex;
  resources: JoinGame_joinGame_players_resources | null;
  color: string;
}

export interface JoinGame_joinGame {
  __typename: "GameSession";
  _id: any;
  name: string;
  observers: number;
  creator: any;
  status: GameStatus;
  mover: any | null;
  players: JoinGame_joinGame_players[];
}

export interface JoinGame {
  joinGame: JoinGame_joinGame;
}

export interface JoinGameVariables {
  gameId: any;
}
