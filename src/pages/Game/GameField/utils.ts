import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { FieldType } from '../../../types';
import { ACTIVE_PLAYER, ActiveGame, ActivePlayer } from '../../../apollo';
import { useAuth } from '../../../context/auth';

type Selector = {
  field?: FieldType
  position?: number
  type?: 'Segment' | 'Text' | 'Square';
}

type Player = ActiveGame['players'][0]

export function useCurrentPlayer() {
  const { user } = useAuth();
  const apolloClient = useApolloClient();
  return apolloClient.readFragment<ActivePlayer>({
    id: `Player:${user?._id}`,
    fragment: ACTIVE_PLAYER,
  });
}

type UsePlayerIndexOption = {
  players: Player[];
  player: Player;
  keys: (keyof Player)[];
};
export function usePlayerIndex({
  player,
  players,
  keys,
}: UsePlayerIndexOption) {
  return useMemo(() => players
    .filter(filteredPlayer => keys.every(key => filteredPlayer[key] === player[key]))
    .findIndex(({ _id }) => _id === player._id),
    [players, player]);
}

export function getSelector(config: Selector) {
  return Object.entries(config).reduce((selector, [attr, value]) => {
    return value ? `${selector}[data-${attr}="${value}"]` : selector;
  }, '');
}

export type PlayerControlProps = {
  player: ActiveGame['players'][0];
  players: ActiveGame['players'];
  color: string;
}

export type Coords = {
  x?: number;
  y?: number;
}
export const getPlayerAvatarSVG = (playerId: string) => playerId;
export const getPlayerURLAvatarSVG = (playerId: string) => `url(#${playerId})`;
