/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL subscription operation: UpdateActiveGames
// ====================================================

export interface UpdateActiveGames_updateActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
  status: GameStatus;
}

export interface UpdateActiveGames {
  updateActiveGames: UpdateActiveGames_updateActiveGames[];
}
