/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActiveGames
// ====================================================

export interface GetActiveGames_getActiveGames_players {
  __typename: "Player";
  _id: any;
}

export interface GetActiveGames_getActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  players: GetActiveGames_getActiveGames_players[];
}

export interface GetActiveGames {
  getActiveGames: GetActiveGames_getActiveGames[];
}
