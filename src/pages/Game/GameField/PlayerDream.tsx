import React, { FC, useEffect, useState } from 'react';
import { useSVGContext } from './GameFieldSVG';
import { COLORS } from '../Game';
import { Coords, getPlayerURLAvatarSVG, getSelector, PlayerControlProps } from './utils';
import { FieldType } from '../../../types';

const PlayerDream: FC<PlayerControlProps> = ({ player, index, players }) => {
  const [dreamCoords, setDreamCoords] = useState<Coords>();
  const svg = useSVGContext();
  const color = `var(${COLORS[index]})`;

  useEffect(() => {
    if (player.dream) {
      const dreamBox = svg?.current?.querySelector(
        getSelector({ field: FieldType.Dream, position: player.dream })
      ) as SVGGElement | null;
      const result = dreamBox?.getBBox();

      if (result) {
        setDreamCoords({ x: result.x, y: result.y });
      }
    }
  }, [player.dream]);

  const avatarUrlSvg = getPlayerURLAvatarSVG(player._id);
  return (
    <>
      {dreamCoords && (<circle cx={dreamCoords?.x} cy={dreamCoords?.y} r="8.5" fill={avatarUrlSvg} stroke={color} />)}
    </>
  );
};

export default PlayerDream;
