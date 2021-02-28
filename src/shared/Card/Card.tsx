import React, { FC } from 'react';
import { Typography } from 'antd';
import cn from 'classnames';

import s from './Card.module.sass';

const { Title } = Typography;

type CardProps = {
  title?: string;
  playersCount?: number;
  className?: string;
  onClick?: () => void;
};

const Card: FC<CardProps> = ({ title, playersCount, className, onClick, children }) => {
  const classNames = cn(className, s.contain);
  return (
    <button type="button" onClick={onClick} className={classNames}>
      {title && (
        <Title level={3} className={s.nameGame}>
          {title}
        </Title>
      )}
      {playersCount && <span className={s.playersCount}>Подключено: {playersCount}</span>}
      {children}
    </button>
  );
};

export default Card;
