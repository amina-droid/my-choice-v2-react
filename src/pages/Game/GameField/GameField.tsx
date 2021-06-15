import React, { FC, useEffect, useRef } from 'react';

import { ActiveGame } from 'api/apollo';
import { FieldType, GameStatus } from 'types';

import { getSelector, getPlayerAvatarSVG, usePlayer } from './utils';
import { GameFieldSVG } from './GameFieldSVG';
import PlayerDream from './PlayerDream';
import PlayerMarker from './PlayerMarker';

import s from './GameField.module.sass';

type GameFieldProps = {
  game: ActiveGame;
  onChoiceDream: (id: number) => void;
};

const addActiveToDream = (cb: any) => (el: Element, i: number, parent: Element[]) => {
  el.classList.add(s.activeDream);
  const listener = (evt: any) => {
    cb(Number((evt.currentTarget as any)?.dataset.position));
  };
  el.addEventListener('click', listener, { once: true });
  return () => {
    el.removeEventListener('click', listener);
    parent.forEach(elm => elm.classList.remove(s.activeDream));
  };
};

const Avatars: FC<Pick<ActiveGame, 'players'>> = React.memo(
  ({ players }) => (
    <>
      {players.map(({ _id, avatar }) => (
        <defs key={`Avatar:${_id}`}>
          <pattern
            id={getPlayerAvatarSVG(_id)}
            height="100%"
            width="100%"
            patternContentUnits="objectBoundingBox"
          >
            <image
              xlinkHref={avatar ?? undefined}
              preserveAspectRatio="xMidYMid slice"
              width="1"
              height="1"
            />
          </pattern>
        </defs>
      ))}
    </>
  ),
  (prev, next) => prev.players.length === next.players.length,
);

type DreamsProps = Pick<ActiveGame, 'players' | 'status'>;
const Dreams: FC<DreamsProps> = ({ players }) => {
  return (
    <>
      {players.map(player => (
        <PlayerDream key={`Dream:${player._id}`} player={player} players={players} />
      ))}
    </>
  );
}; // , (
//   prev,
//   next,
// ) => prev.status !== GameStatus.ChoiceDream
//   && prev.players.length === next.players.length
//   && prev.players.every((player) => !isNil(player.dream)));

const GameField: FC<GameFieldProps> = ({ game, onChoiceDream }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const myPlayer = usePlayer(game._id);

  useEffect(() => {
    if (!myPlayer) return () => {};
    const playerDreamNotExist = game.status === GameStatus.ChoiceDream && !myPlayer?.dream;

    if (playerDreamNotExist) {
      const dreamFields = svgRef?.current?.querySelectorAll(
        getSelector({ field: FieldType.Dream }),
      );

      if (!dreamFields) return () => {};
      const unlisteners = Array.from(dreamFields).map(addActiveToDream(onChoiceDream));

      return () => unlisteners.forEach(unlistener => unlistener());
    }

    return () => {};
  }, [game.status, myPlayer?.dream]);

  return (
    <>
      <GameFieldSVG ref={svgRef}>
        <defs>
          <filter
            id="marker_shadow"
            x="0.543398"
            y="0.725572"
            width="108"
            height="120.5"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx="0.451684" dy="-0.348287" />
            <feGaussianBlur stdDeviation="3.34259" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx="2.13524" dy="-1.64645" />
            <feGaussianBlur stdDeviation="3.62407" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.164 0" />
            <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx="5.5434" dy="-4.27443" />
            <feGaussianBlur stdDeviation="19" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.106 0" />
            <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape" />
          </filter>
        </defs>
        <Avatars players={game.players} />
        <Dreams status={game.status} players={game.players} />
        {game.players.map(player => (
          <PlayerMarker key={`Player:${player._id}`} player={player} players={game.players} />
        ))}
      </GameFieldSVG>
    </>
  );
};

export default GameField;
