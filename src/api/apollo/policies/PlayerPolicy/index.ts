import { TypePolicy } from '@apollo/client/cache/inmemory/policies';
import { ACTIVE_GAME, ActiveGame } from 'api/apollo/fragments';
import { isNil } from 'lodash';

const COLORS = [
  '--game-green',
  '--game-blue',
  '--game-yellow',
  '--game-pink',
  '--game-violet',
  '--game-orange',
  '--game-grey',
  '--game-black',
];

const PlayerPolicy: TypePolicy = {
  fields: {
    color: {
      read: (previousColor, { variables, cache, readField }) => {
        if (previousColor) return previousColor;
        const playerId = readField('_id');

        const gameId = cache.identify({
          __typename: 'GameSession',
          _id: variables?.['gameId'],
        });
        const gameSession = cache.readFragment<ActiveGame>({
          id: gameId,
          fragment: ACTIVE_GAME,
          fragmentName: 'ActiveGame',
          returnPartialData: true,
        });

        if (!gameId) {
          return undefined;
        }

        const playerIndex = gameSession?.players?.findIndex(({ _id }) => _id === playerId);
        if (isNil(playerIndex)) return undefined;
        const colorVar = playerIndex > -1 ? COLORS[playerIndex] : COLORS[0];
        return `var(${colorVar})`;
      },
    },
  },
};

export default PlayerPolicy;
