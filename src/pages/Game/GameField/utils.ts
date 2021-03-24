import { FieldType } from '../../../types';
import { ActiveGame } from '../../../apollo';

type Selector = {
  field?: FieldType
  position?: number
  type?: 'Segment' | 'Text' | 'Square';
}

export function getSelector({
  field,
  position,
  type,
  }: Selector) {
  let selector = '';

  if (field) {
    selector += `[data-field="${field}"]`;
  }

  if (position) {
    selector += `[data-position="${position}"]`;
  }

  if (type) {
    selector += `[data-type="${type}"]`;
  }

  return selector;
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
