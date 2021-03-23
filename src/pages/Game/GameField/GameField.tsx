import React, { FC, useContext, useEffect, useRef, Suspense } from 'react';
import { Spin } from 'antd';
import { ActiveGame } from '../../../apollo';
import { GameStatus } from '../../../types';
import { AuthContext } from '../../../context/auth';

import s from './GameField.module.sass';

const GameFieldSvg = React.lazy(() => import('./GameFieldSvg'));

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

const GameField: FC<GameFieldProps> = ({ game, onChoiceDream }) => {
  const { user } = useContext(AuthContext);
  const svgRef = useRef<SVGSVGElement>(null);

  const myPlayer = game.players.find(player => player._id === user?._id);

  useEffect(() => {
    const playerDreamNotExist = game.status === GameStatus.ChoiceDream &&
      game.players.some(player => player._id === user?._id && !player.dream);

    if (playerDreamNotExist) {
      const dreamFields = svgRef?.current?.querySelectorAll('[data-field="Dream"]');

      if (!dreamFields) return () => {};
      const unlisteners = Array.from(dreamFields).map(addActiveToDream(onChoiceDream));

      return () => unlisteners.forEach(unlistener => unlistener());
    }

    return () => {};
  }, [game.status, myPlayer?.dream]);

  return (
    <>
      <StaticGameField ref={svgRef} />
    </>
  );
};

const StaticGameField = React.memo(
  React.forwardRef<SVGSVGElement>((_, ref) => {
    console.log('FIELD RERENDER!!!');
    return (
      <Suspense fallback={<Spin size="large" />}>
        <GameFieldSvg ref={ref} />
      </Suspense>
    );
  }),
);

export default GameField;
