/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlayerPosition, PlayerStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL fragment: ActiveGame
// ====================================================

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
  status: PlayerStatus;
  resources: ActiveGame_players_resources | null;
  hold: number | null;
  avatar: string | null;
}

export interface ActiveGame {
  __typename: "GameSession";
  _id: any;
  name: string;
  observers: number;
  players: ActiveGame_players[];
}
