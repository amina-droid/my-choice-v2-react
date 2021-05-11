/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GameStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GetActiveGames
// ====================================================

export interface GetActiveGames_getActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
  status: GameStatus;
}

export interface GetActiveGames {
  getActiveGames: GetActiveGames_getActiveGames[];
}
