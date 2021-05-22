/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStatistic
// ====================================================

export interface GetStatistic_games_winner_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetStatistic_games_winner {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetStatistic_games_winner_photos[];
}

export interface GetStatistic_games_tournament {
  __typename: "Tournament";
  _id: any;
  name: string;
}

export interface GetStatistic_games_players_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetStatistic_games_players {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetStatistic_games_players_photos[];
}

export interface GetStatistic_games {
  __typename: "Game";
  _id: any;
  name: string;
  createdAt: any;
  winner: GetStatistic_games_winner | null;
  tournament: GetStatistic_games_tournament | null;
  players: GetStatistic_games_players[];
}

export interface GetStatistic {
  games: GetStatistic_games[];
}

export interface GetStatisticVariables {
  userId?: any | null;
}
