import { Statistic as StatisticGame } from '../../apollo';

export type GamesStatistic = {
  winCount: number;
  tournamentCount: number;
  tournamentsConfig: Map<string, string>;
  categories: Record<string, StatisticGame[]>
}

const NON_TOURNAMENT_GAMES = 'non_tournament';

export function gamesToStatistic(games?: StatisticGame[], userId?: string) {
  if (!games || !userId) return undefined;

  return games.reduce<GamesStatistic>((acc, game) => {
    if (game.winner?._id === userId) {
      acc.winCount += 1;
    }

    if (game.tournament) {
      acc.tournamentCount += 1;
      acc.tournamentsConfig.set(game.tournament._id, game.tournament.name);
      const tournamentGames = acc.categories[game.tournament._id];

      if (!tournamentGames) {
        acc.categories[game.tournament._id] = [];
      }

      acc.categories[game.tournament._id].push(game);
    } else {
      acc.categories[NON_TOURNAMENT_GAMES].push(game);
    }

    return acc;
  }, {
    winCount: 0,
    tournamentsConfig: new Map<string, string>([[NON_TOURNAMENT_GAMES, 'Сетевые игры']]),
    tournamentCount: 0,
    categories: {
      [NON_TOURNAMENT_GAMES]: [],
    },
  });
}
