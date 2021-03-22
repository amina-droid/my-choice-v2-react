import React, { FC, useContext, useEffect, useRef } from 'react';
import { ReactComponent as GameFieldSvg } from './GameSVG.svg';
import { ActiveGame } from '../../../apollo';
import { GameStatus } from '../../../types';
import { AuthContext } from '../../../context/auth';

import s from './GameField.module.sass';

type GameFieldProps = {
  game: ActiveGame;
  onChoiceDream: (id: number) => void;
};

const addActiveToDream = (cb: any) => (el: Element, i: number, parent: Element[]) => {
  el.classList.add(s.activeDream);
  const listener = (evt: any) => cb(Number((evt.currentTarget as any)?.dataset.position));
  el.addEventListener('click', listener);
  return () => {
    el.removeEventListener('click', listener);
    parent.forEach(elm => elm.classList.remove(s.activeDream));
  };
};

const GameField: FC<GameFieldProps> = ({ game, onChoiceDream }) => {
  const { user } = useContext(AuthContext);
  const svgRef = useRef<SVGSVGElement>(null);

  const myPlayer = game.players.find(player => player._id === user?._id);

  useEffect(() => {
    console.log(game);
    if (
      game.status === GameStatus.ChoiceDream &&
      game.players.some(player => player._id === user?._id && !player.dream)
    ) {
      const dreamFields = svgRef?.current?.querySelectorAll('[data-field="Dream"]');

      if (!dreamFields) return () => {};
      const unlisteners = Array.from(dreamFields).map(addActiveToDream(onChoiceDream));

      return () => unlisteners.forEach(unlistener => unlistener());
    }

    return () => {};
  }, [game.status, myPlayer?.dream]);
  console.log(svgRef);

  return (
    <>
      <StaticGameField ref={svgRef} />
    </>
  );
};

const StaticGameField = React.memo(
  React.forwardRef<SVGSVGElement>((_, ref) => {
    console.log('FIELD RERENDER!!!');
    return <GameFieldSvg ref={ref} />;
  }),
);

export default GameField;
