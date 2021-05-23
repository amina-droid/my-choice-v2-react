import React, { FC, useEffect, useRef } from 'react';

import { useSVGContext } from './GameFieldSVG';
import { Coords, getPlayerURLAvatarSVG, getSelector, PlayerControlProps, usePlayerIndex } from './utils';
import { FieldType } from '../../../types';

enum DreamPadding {
  X = 10,
  Y = 3,
}

const MAX_COUNT_IN_SIDE = 4;
const CIRCLE_SIZE = 12;
function getDreamPosition(dreamSvg: SVGGElement | null, index: number) {
  const {
    width = 0,
    height = 0,
    x = 0,
    y = 0,
  } = dreamSvg?.getBBox() || {};

  const availableWidth = width - (DreamPadding.X * 2);
  const markersMargin = Math.abs((availableWidth / MAX_COUNT_IN_SIDE) - CIRCLE_SIZE);

  const goToBottom = index > MAX_COUNT_IN_SIDE;
  const markerIndex = index % MAX_COUNT_IN_SIDE;

  return {
    x: x + (DreamPadding.X + CIRCLE_SIZE) + (
      (
        (markerIndex - 1) * CIRCLE_SIZE)
      + ((markerIndex - 1) * markersMargin)
    ),
    y: y + (goToBottom ? height - DreamPadding.Y : DreamPadding.Y),
  };
}

const PlayerDream: FC<PlayerControlProps> = ({ player, players }) => {
  const dreamCoords = useRef<Coords>();
  const svg = useSVGContext();
  const playerIndex = usePlayerIndex({
    players,
    player,
    keys: ['dream'],
  });

  useEffect(() => {
    if (player.dream) {
      const dreamBox = svg?.current?.querySelector(
        getSelector({ field: FieldType.Dream, position: player.dream })
      ) as SVGGElement | null;

      dreamCoords.current = getDreamPosition(dreamBox, playerIndex);
    }
  }, [player.dream, playerIndex]);

  const avatarUrlSvg = getPlayerURLAvatarSVG(player._id);
  return (
    <>
      {dreamCoords.current && (
        <circle
          cx={dreamCoords.current?.x}
          cy={dreamCoords.current?.y}
          r="8.5"
          fill={avatarUrlSvg}
          stroke={player.color}
        />
      )}
    </>
  );
};

export default PlayerDream;
