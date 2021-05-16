/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStatus, PlayerPosition, UserSex } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL fragment: ActiveGame
// ====================================================

export interface ActiveGame_timers {
  __typename: "GameSessionTimers";
  dice: any | null;
  card: any | null;
}

export interface ActiveGame_players_resources {
  __typename: "Resources";
  lives: number | null;
  white: number | null;
  dark: number | null;
  money: number | null;
}

export interface ActiveGame_players {
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
  resources: ActiveGame_players_resources | null;
  color: string;
}

export interface ActiveGame {
  __typename: "GameSession";
  _id: any;
  name: string;
  observers: number;
  creator: any;
  status: GameStatus;
  winner: any | null;
  mover: any | null;
  timers: ActiveGame_timers | null;
  players: ActiveGame_players[];
}
