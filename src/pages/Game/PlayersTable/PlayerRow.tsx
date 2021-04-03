import React, { FC } from 'react';
import { Avatar, Badge, Spin, Tooltip } from 'antd';
import cn from 'classnames';
import { ActivePlayer } from '../../../apollo';

import { ReactComponent as Lives } from '../Resources/Lives.svg';
import { ReactComponent as Like } from '../Resources/Like.svg';
import { ReactComponent as Dislike } from '../Resources/Dislike.svg';
import { ReactComponent as Money } from '../Resources/Money.svg';
import Resource from './Resource';

import s from './PlayersTable.module.sass';

type Props = {
  player: ActivePlayer;
  className?: string;
}

type Resources<Keys> = {
  [K in keyof Keys]: [K, JSX.Element, string]
}[keyof Keys]

type ResourcesDict = Resources<Omit<NonNullable<ActivePlayer['resources']>, '__typename'>>

const RESOURCES_DICT: ResourcesDict[] = [
  ['white', <Like key="Like" />, 'Белый социальный капитал'],
  ['dark', <Dislike key="Dislike" />, 'Черный социальный капитал'],
  ['money', <Money key="Money" />, 'Деньги'],
  ['lives', <Lives key="Lives" />, 'Жизни'],
];

const PlayerRow: FC<Props> = ({ player, className: outerClassName }) => {
  const className = cn(
    outerClassName,
    s.playerContainer,
    player.gameover && s.playerGameOver,
  );

  return (
    <Spin spinning={player.disconnected ?? false}>
      <div key={player._id} className={className}>
        <Badge count={player.hold} offset={[-20, 20]} className={s.playerHold}>
          <Tooltip placement="top" title={player.nickname} color={player.color}>
            <Avatar
              size={120}
              src={player.avatar}
              shape="circle"
              className={s.avatar}
              style={{ borderColor: player.color }}
            />
          </Tooltip>
        </Badge>
        <div className={s.resources}>
          {RESOURCES_DICT.map(([key, icon, title]) => (
            <Resource
              key={key}
              className={s.resource}
              color={player.color}
              title={title}
              resource={player.resources?.[key]}
            >
              {icon}
            </Resource>
          ))}
        </div>
      </div>
    </Spin>
  );
};

export default PlayerRow;
