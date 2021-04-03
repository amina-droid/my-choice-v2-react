/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: UpdateActiveGames
// ====================================================

export interface UpdateActiveGames_updateActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
}

export interface UpdateActiveGames {
  updateActiveGames: UpdateActiveGames_updateActiveGames[];
}
