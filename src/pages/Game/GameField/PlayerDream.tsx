import React, { FC, useEffect, useRef, useState } from 'react';
import { useSVGContext } from './GameFieldSVG';
import { COLORS } from '../Game';
import { Coords, getPlayerURLAvatarSVG, getSelector, PlayerControlProps } from './utils';
import { FieldType } from '../../../types';

const PlayerDream: FC<PlayerControlProps> = ({ player, index, players }) => {
  const dreamCoords = useRef<Coords>();
  const svg = useSVGContext();
  const color = `var(${COLORS[index]})`;

  useEffect(() => {
    if (player.dream) {
      const dreamBox = svg?.current?.querySelector(
        getSelector({ field: FieldType.Dream, position: player.dream })
      ) as SVGGElement | null;
      const result = dreamBox?.getBBox();

      if (result) {
        dreamCoords.current = ({ x: result.x, y: result.y });
      }
    }
  }, [player.dream]);

  const avatarUrlSvg = getPlayerURLAvatarSVG(player._id);
  return (
    <>
      {dreamCoords.current && (
        <circle cx={dreamCoords.current?.x} cy={dreamCoords.current?.y} r="8.5" fill={avatarUrlSvg} stroke={color} />
      )}
    </>
  );
};

export default PlayerDream;
