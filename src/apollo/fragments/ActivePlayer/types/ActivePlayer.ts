/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlayerPosition } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL fragment: ActivePlayer
// ====================================================

export interface ActivePlayer_resources {
  __typename: "Resources";
  lives: number | null;
  white: number | null;
  dark: number | null;
  money: number | null;
}

export interface ActivePlayer {
  __typename: "Player";
  _id: any;
  nickname: string;
  position: PlayerPosition | null;
  cell: number | null;
  dream: number | null;
  resources: ActivePlayer_resources | null;
  hold: number | null;
  gameover: boolean | null;
  avatar: string | null;
}
