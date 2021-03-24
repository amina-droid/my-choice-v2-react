import React, { FC, useEffect, useState } from 'react';
import { Animate } from 'react-move';
import { easeExpOut } from 'd3-ease';
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

function getInnerCoords(cell: number, playerIndex: number, svg: SVGSVGElement): Coords {
  const odd = playerIndex % 2;
  const svgSize = svg?.getBBox();
  const cx = (svgSize?.width ?? 0) / 2 + svgSize.x;
  const cy = (svgSize?.height ?? 0) / 2 + svgSize.y;

  const innerFieldBBox = (svg?.getElementById('InnerField') as SVGGElement)?.getBBox();
  const radius = innerFieldBBox.height / 2;

  return {
    x: cx + (radius * Math.cos(cell * 18)),
    y: cy + (radius * Math.sin(cell * 18)),
  };
}

const TIMING = {
  duration: 800,
  ease: easeExpOut,
};

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
      case PlayerPosition.Inner: {
        setMarkerCoords(getInnerCoords(player?.cell ?? 0, index, svg?.current!));
        break;
      }
      default: {
        setMarkerCoords({});
      }
    }
  }, [player.cell, player.position]);

  const color = `var(${COLORS[index]})`;

  return (markerCoords ? (
    <Animate
      start={{ x: markerCoords?.x ?? 0, y: markerCoords?.y ?? 0 }}
      enter={{ x: [markerCoords?.x ?? 0], y: [markerCoords?.y ?? 0], timing: TIMING }}
      update={{ x: [markerCoords?.x ?? 0], y: [markerCoords?.y ?? 0], timing: TIMING }}
    >
      {(state) => (
        <svg
          fill="none"
          viewBox="0 0 109 122"
          width="109"
          height="122"
          x={state?.x}
          y={state?.y}
        >
          <MemoMarker playerId={player._id} color={color} />
        </svg>
      )}
    </Animate>
  ) : null);
};

const MemoMarker = React.memo<{ playerId: string, color: string }>(({ playerId, color }) => {
  const avatarUrlSvg = getPlayerURLAvatarSVG(playerId);

  return (
    <g filter="url(#marker_shadow)">
      <circle cx="49" cy="58" r="13" fill={avatarUrlSvg} />
      <path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.0002 43C57.8366 43 65 50.1635 65 58.9999 65 66.76 53.4219 80.5322 48.5514 87.5c-3.4355-5.6114-12.3562-17.2718-14.4694-22.7066l-.002-.003.0006-.0006C33.383 62.9943 33 61.0418 33 59c0-8.8364 7.1634-15.9999 15.9999-15.9999L49.0002 43zm-.2835 2.8704c6.6963 0 12.1249 5.4286 12.1249 12.1249S55.413 70.1202 48.7167 70.1202s-12.1249-5.4286-12.1249-12.1249 5.4286-12.1249 12.1249-12.1249z"
      />
    </g>
  );
}, (
  prev,
  next,
) => prev.playerId === next.playerId && prev.color === next.color);

export default PlayerMarker;
