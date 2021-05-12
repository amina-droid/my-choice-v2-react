import React, { FC } from 'react';
import { Typography } from 'antd';
import cn from 'classnames';

import s from './Card.module.sass';
import { GameStatus } from '../../types';

const { Title } = Typography;

const GAME_STATUS_DICTIONARY = {
  [GameStatus.Awaiting]: 'В ожидании игроков',
  [GameStatus.InProgress]: 'В прогрессе',
  [GameStatus.ChoiceDream]: 'В прогрессе',
  [GameStatus.Finished]: 'Игра окончена',
};

type CardProps = {
  title?: string;
  status?: GameStatus;
  playersCount?: number;
  className?: string;
  onClick?: () => void;
};

const Card: FC<CardProps> = ({ title, status, playersCount, className, onClick, children }) => {
  const classNames = cn(
    className,
    s.contain,
    status && status !== GameStatus.Awaiting && s.statusAwaiting,
  );
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames}
      disabled={Boolean(status === GameStatus.Finished)}
    >
      {title && (
        <>
          {status && (
            <span
              className={cn(
                s.status,
                status !== GameStatus.Awaiting && s.statusNotAwaiting,
                status === GameStatus.Finished && s.statusFinished,
                status === GameStatus.Awaiting && s.statusAwaiting,
              )}
            >
              {GAME_STATUS_DICTIONARY[status]}
            </span>
          )}
          <Title level={3} className={s.nameGame}>
            {title}
          </Title>
          <span className={s.playersCount}>Подключено: {playersCount ? playersCount : 0}</span>
        </>
      )}

      {children}
    </button>
  );
};

export default Card;
