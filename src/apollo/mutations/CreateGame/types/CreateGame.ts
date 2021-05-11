/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateGame
// ====================================================

export interface CreateGame_createGame {
  __typename: "GameSession";
  _id: any;
}

export interface CreateGame {
  createGame: CreateGame_createGame;
}

export interface CreateGameVariables {
  name: string;
  observerMode?: boolean | null;
  tournament?: any | null;
}
