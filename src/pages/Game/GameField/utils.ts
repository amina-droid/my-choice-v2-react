import { FieldType } from '../../../types';
import { ActiveGame } from '../../../apollo';

type Selector = {
  field?: FieldType
  position?: number
  type?: 'Segment' | 'Text' | 'Square';
}

export function getSelector(config: Selector) {
  return Object.entries(config).reduce((selector, [attr, value]) => {
    return value ? `${selector}[data-${attr}="${value}"]` : selector;
  }, '');
}

export type PlayerControlProps = {
  player: ActiveGame['players'][0];
  players: ActiveGame['players'];
  index: number;
}

export type Coords = {
  x?: number;
  y?: number;
}
export const getPlayerAvatarSVG = (playerId: string) => playerId;
export const getPlayerURLAvatarSVG = (playerId: string) => `url(#${playerId})`;
