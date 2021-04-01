/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: UpdateActiveGames
// ====================================================

export interface UpdateActiveGames_updateActiveGames_players {
  __typename: "Player";
  _id: any;
}

export interface UpdateActiveGames_updateActiveGames {
  __typename: "GameSession";
  _id: any;
  name: string;
  players: UpdateActiveGames_updateActiveGames_players[];
}

export interface UpdateActiveGames {
  updateActiveGames: UpdateActiveGames_updateActiveGames[];
}
