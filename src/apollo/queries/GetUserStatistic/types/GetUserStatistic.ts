/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserStatistic
// ====================================================

export interface GetUserStatistic_userGames_winner_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetUserStatistic_userGames_winner {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetUserStatistic_userGames_winner_photos[];
}

export interface GetUserStatistic_userGames_tournament {
  __typename: "Tournament";
  _id: any;
  name: string;
}

export interface GetUserStatistic_userGames_players_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetUserStatistic_userGames_players {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetUserStatistic_userGames_players_photos[];
}

export interface GetUserStatistic_userGames {
  __typename: "Game";
  _id: any;
  name: string;
  createdAt: any;
  winner: GetUserStatistic_userGames_winner | null;
  tournament: GetUserStatistic_userGames_tournament | null;
  players: GetUserStatistic_userGames_players[];
}

export interface GetUserStatistic {
  userGames: GetUserStatistic_userGames[];
}

export interface GetUserStatisticVariables {
  userId?: any | null;
}
