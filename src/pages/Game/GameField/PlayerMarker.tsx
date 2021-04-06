import React, { FC, useEffect, useState } from 'react';
import { Animate } from 'react-move';
import { easeExpOut } from 'd3-ease';
import { useSVGContext } from './GameFieldSVG';
import { FieldType, PlayerPosition } from '../../../types';
import { Coords, getPlayerURLAvatarSVG, getSelector, PlayerControlProps, usePlayerIndex } from './utils';

enum MarkerSize {
  Width = 49.5,
  Height = 91
}
enum StartPadding {
  Y = 10,
  X = 10
}
const HALF_MARKER_MARGIN = 7.5;
const MARKER_POSITION_TRANSFORM = `translate(-${MarkerSize.Width}, -${MarkerSize.Height})`;
function toRadian(degree: number) {
  return degree * (Math.PI / 180);
}

function getStartCoords(startSVGElement: SVGGElement | null, playerIndex: number) {
  const odd = playerIndex % 2;

  const {
    x = 0,
    y = 0,
  } = startSVGElement?.getBBox() ?? {};

  return odd ? {
    x: StartPadding.X + x + ((playerIndex - 1) * HALF_MARKER_MARGIN),
    y: StartPadding.Y + (y + MarkerSize.Height / 2),
  } : {
    x: StartPadding.X + x + (playerIndex * HALF_MARKER_MARGIN),
    y: StartPadding.Y + y,
  };
}

enum InnerValues {
  SEGMENT_PADDING = 5,
  MARKER_MARGIN = 12,
  SEGMENT_ANGLE = 18,
  RADIUS_PADDING = 10,
}
function getInnerCoords(cell: number, playerIndex: number, svg: SVGSVGElement): Coords {
  const odd = playerIndex % 2;
  const innerFieldBBox = (svg?.getElementById('InnerField') as SVGGElement)?.getBBox();
  const cx = (innerFieldBBox?.width ?? 0) / 2 + innerFieldBBox.x;
  const cy = (innerFieldBBox?.height ?? 0) / 2 + innerFieldBBox.y;
  const isRightCirclePart = cell >= 8 && cell < 18;

  const circleSegment = Math.abs(cell + (isRightCirclePart ? 7 : 8));

  const radius = (innerFieldBBox.width / 2)
    - InnerValues.RADIUS_PADDING
    - (odd
      ? ((playerIndex - 1) * HALF_MARKER_MARGIN)
      : (playerIndex * HALF_MARKER_MARGIN)
    );

  const angle = circleSegment * InnerValues.SEGMENT_ANGLE + (
    (isRightCirclePart
      ? 1
      : -1
    ) * (odd
      ? InnerValues.SEGMENT_PADDING + InnerValues.MARKER_MARGIN
      : InnerValues.SEGMENT_PADDING
    ));

  const radian = toRadian(angle);

  return {
    x: cx + (radius * Math.cos(radian)),
    y: cy + (radius * Math.sin(radian)),
  };
}

const MAX_COUNT_IN_SIDE = 4;
enum OuterPadding {
  X = 30,
  Y = 20,
}
function getOuterCoords(cell: number, playerIndex: number, svg: SVGSVGElement): Coords {
  const selector = getSelector({
    position: cell,
  });
  const {
    width = 0,
    height = 0,
    x = 0,
    y = 0,
  } = (svg?.getElementById('OuterField')?.querySelector(selector) as SVGGElement)?.getBBox();
  const markerWidth = (width - (OuterPadding.X * 2)) / MAX_COUNT_IN_SIDE;
  const availableHeight = (height - OuterPadding.Y * 2);
  const goToBottom = playerIndex > MAX_COUNT_IN_SIDE;
  const markerIndex = playerIndex % MAX_COUNT_IN_SIDE;

  return {
    x: OuterPadding.X + x + (markerWidth * (markerIndex - 1)),
    y: OuterPadding.Y + y + (goToBottom ? availableHeight : 0),
  };
}

const TIMING = {
  duration: 800,
  ease: easeExpOut,
};

const PlayerMarker: FC<PlayerControlProps> = ({ player, players }) => {
  const [markerCoords, setMarkerCoords] = useState<Coords>();
  const svg = useSVGContext();
  const playerIndex = usePlayerIndex({
    players,
    player,
    keys: ['cell', 'position'],
  });

  useEffect(() => {
    switch (player.position) {
    case PlayerPosition.Start: {
      const startBox = svg?.current?.querySelector(
          getSelector({ field: FieldType.Start }),
        ) as SVGGElement | null;

      setMarkerCoords(getStartCoords(startBox, playerIndex));
      break;
    }
    case PlayerPosition.Inner: {
      setMarkerCoords(getInnerCoords(player?.cell ?? 0, playerIndex, svg?.current!));
      break;
    }
    case PlayerPosition.Outer: {
      setMarkerCoords(getOuterCoords(player?.cell ?? 0, playerIndex, svg?.current!));
      break;
    }
    default: {
      setMarkerCoords({});
    }
    }
  }, [player.cell, player.position, playerIndex]);

  return (markerCoords ? (
    <Animate
      start={{ x: markerCoords?.x ?? 0, y: markerCoords?.y ?? 0 }}
      enter={{ x: [markerCoords?.x ?? 0], y: [markerCoords?.y ?? 0], timing: TIMING }}
      update={{ x: [markerCoords?.x ?? 0], y: [markerCoords?.y ?? 0], timing: TIMING }}
    >
      {(state) => (
        <g
          transform={MARKER_POSITION_TRANSFORM}
        >
          <svg
            fill="none"
            viewBox="0 0 109 122"
            x={state?.x}
            y={state?.y}
            width="109"
            height="122"
          >
            <MemoMarker playerId={player._id} color={player.color} />
          </svg>
        </g>
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
