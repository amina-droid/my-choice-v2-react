import React, { FC } from 'react';
import { Typography } from 'antd';
import cn from 'classnames';

import s from './Card.module.sass';

const { Title } = Typography;

type CardProps = {
  title?: string;
  playersCount?: number;
  className?: string;
};

const Card: FC<CardProps> = ({ title, playersCount, className, children }) => {
  const classNames = cn(className, s.contain);
  return (
    <div className={classNames}>
      {title && (
        <Title level={3} className={s.nameGame}>
          {title}
        </Title>
      )}
      {playersCount && <span className={s.playersCount}>Подключено: {playersCount}</span>}
      {children}
    </div>
  );
};

export default Card;
