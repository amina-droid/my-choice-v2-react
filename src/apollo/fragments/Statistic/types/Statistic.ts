/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Statistic
// ====================================================

export interface Statistic_winner_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface Statistic_winner {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: Statistic_winner_photos[];
}

export interface Statistic_tournament {
  __typename: "Tournament";
  _id: any;
  name: string;
}

export interface Statistic_players_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface Statistic_players {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: Statistic_players_photos[];
}

export interface Statistic {
  __typename: "Game";
  _id: any;
  name: string;
  createdAt: any;
  winner: Statistic_winner | null;
  tournament: Statistic_tournament | null;
  players: Statistic_players[];
}
