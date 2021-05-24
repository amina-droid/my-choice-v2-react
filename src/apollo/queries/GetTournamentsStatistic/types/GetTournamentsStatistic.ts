/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTournamentsStatistic
// ====================================================

export interface GetTournamentsStatistic_tournamentGames_winner_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetTournamentsStatistic_tournamentGames_winner {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetTournamentsStatistic_tournamentGames_winner_photos[];
}

export interface GetTournamentsStatistic_tournamentGames_tournament {
  __typename: "Tournament";
  _id: any;
  name: string;
}

export interface GetTournamentsStatistic_tournamentGames_players_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetTournamentsStatistic_tournamentGames_players {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GetTournamentsStatistic_tournamentGames_players_photos[];
}

export interface GetTournamentsStatistic_tournamentGames {
  __typename: "Game";
  _id: any;
  name: string;
  createdAt: any;
  winner: GetTournamentsStatistic_tournamentGames_winner | null;
  tournament: GetTournamentsStatistic_tournamentGames_tournament | null;
  players: GetTournamentsStatistic_tournamentGames_players[];
}

export interface GetTournamentsStatistic {
  tournamentGames: GetTournamentsStatistic_tournamentGames[];
}

export interface GetTournamentsStatisticVariables {
  limit?: number | null;
  offset?: number | null;
  tournamentId?: any | null;
}
