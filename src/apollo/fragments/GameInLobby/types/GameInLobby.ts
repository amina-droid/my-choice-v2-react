/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStatus } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL fragment: GameInLobby
// ====================================================

export interface GameInLobby {
  __typename: "GameSession";
  _id: any;
  name: string;
  playersCount: number;
  status: GameStatus;
}
