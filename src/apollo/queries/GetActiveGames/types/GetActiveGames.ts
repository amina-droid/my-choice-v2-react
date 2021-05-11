/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActiveGames
// ====================================================

export interface GetActiveGames_getActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
}

export interface GetActiveGames {
  getActiveGames: GetActiveGames_getActiveGames[];
}
