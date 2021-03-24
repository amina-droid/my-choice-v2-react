import React, { FC, useEffect, useState } from 'react';
import { useSVGContext } from './GameFieldSVG';
import { FieldType, PlayerPosition } from '../../../types';
import { Coords, getPlayerURLAvatarSVG, getSelector, PlayerControlProps } from './utils';
import { COLORS } from '../Game';

enum MarkerSize {
  Width = 49.5,
  Height = 91
}
enum StartPadding {
  Y = 10,
  X = 10
}
const StartMarkerMargin = 7.5;

function getStartCoords(startSVGElement: SVGGElement | null, playerIndex: number) {
  const odd = playerIndex % 2;

  const {
    x = 0,
    y = 0,
  } = startSVGElement?.getBBox() ?? {};
  return odd ? {
    x: StartPadding.X + (x - MarkerSize.Width) + ((playerIndex - 1) * StartMarkerMargin),
    y: StartPadding.Y + (y - MarkerSize.Height / 2),
  } : {
    x: StartPadding.X + (x - MarkerSize.Width) + (playerIndex * StartMarkerMargin),
    y: StartPadding.Y + (y - MarkerSize.Height),
  };
}

const PlayerMarker: FC<PlayerControlProps> = ({ player, index, players }) => {
  const [markerCoords, setMarkerCoords] = useState<Coords>();
  const svg = useSVGContext();

  useEffect(() => {
    switch (player.position) {
      case PlayerPosition.Start: {
        const startBox = svg?.current?.querySelector(
          getSelector({ field: FieldType.Start }),
        ) as SVGGElement | null;

        setMarkerCoords(getStartCoords(startBox, index));
        break;
      }
      default: {
        setMarkerCoords({});
      }
    }
  }, [player.cell, player.position]);

  const color = `var(${COLORS[index]})`;
  const avatarUrlSvg = getPlayerURLAvatarSVG(player._id);
  return (markerCoords ? (
    <svg fill="none" viewBox="0 0 109 122" width="109" height="122" x={markerCoords?.x} y={markerCoords?.y}>
      <g filter="url(#marker_shadow)">
        <circle cx="49" cy="58" r="13" fill={avatarUrlSvg} />
        <path
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M49.0002 43C57.8366 43 65 50.1635 65 58.9999 65 66.76 53.4219 80.5322 48.5514 87.5c-3.4355-5.6114-12.3562-17.2718-14.4694-22.7066l-.002-.003.0006-.0006C33.383 62.9943 33 61.0418 33 59c0-8.8364 7.1634-15.9999 15.9999-15.9999L49.0002 43zm-.2835 2.8704c6.6963 0 12.1249 5.4286 12.1249 12.1249S55.413 70.1202 48.7167 70.1202s-12.1249-5.4286-12.1249-12.1249 5.4286-12.1249 12.1249-12.1249z"
        />
      </g>
    </svg>
  ) : null);
};

export default PlayerMarker;
