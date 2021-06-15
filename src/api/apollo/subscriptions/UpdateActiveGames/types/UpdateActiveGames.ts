/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GameStatus } from "types/globalTypes";

// ====================================================
// GraphQL subscription operation: UpdateActiveGames
// ====================================================

export interface UpdateActiveGames_updateActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
  status: GameStatus;
  tournament: any | null;
}

export interface UpdateActiveGames {
  updateActiveGames: UpdateActiveGames_updateActiveGames[];
}
