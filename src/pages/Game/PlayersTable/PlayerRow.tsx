import React, { FC, useEffect } from 'react';
import { isNil } from 'lodash';
import { Avatar, Badge, message, Spin, Tooltip } from 'antd';
import cn from 'classnames';
import { ActivePlayer } from '../../../apollo';

import { ReactComponent as Lives } from '../Resources/Lives.svg';
import { ReactComponent as Like } from '../Resources/Like.svg';
import { ReactComponent as Dislike } from '../Resources/Dislike.svg';
import { ReactComponent as Money } from '../Resources/Money.svg';
import Resource from './Resource';
import usePrevious from '../../../utils/usePrevious';
import { useAuth } from '../../../context/auth';

import s from './PlayersTable.module.sass';

const RESOURCES_DICT_OBJ: Record<string, JSX.Element> = {
  white: <Like key="Like" />,
  dark: <Dislike key="Dislike" />,
  money: <Money key="Money" />,
  lives: <Lives key="Lives" />,
};

type Props = {
  player: ActivePlayer;
  className?: string;
  mover?: string;
};

type Resources<Keys> = {
  [K in keyof Keys]: [K, JSX.Element, string];
}[keyof Keys];

type ResourcesDict = Resources<Omit<NonNullable<ActivePlayer['resources']>, '__typename'>>;

const useResourcesNotify = (
  resource?: number | null,
  resourceType?: string,
  playerName?: string,
) => {
  const prevRes = usePrevious(resource);

  useEffect(() => {
    if (isNil(resource)) return;
    if (resourceType && prevRes) {
      message.info(
        <>
          {playerName ? playerName : 'Вы'} получил {prevRes - resource}
          {RESOURCES_DICT_OBJ[resourceType]}
        </>,
      );
    }
  }, [resource]);
};

const RESOURCES_DICT: ResourcesDict[] = [
  ['white', <Like key="Like" />, 'Белый социальный капитал'],
  ['dark', <Dislike key="Dislike" />, 'Черный социальный капитал'],
  ['money', <Money key="Money" />, 'Деньги'],
  ['lives', <Lives key="Lives" />, 'Жизни'],
];

const PlayerRow: FC<Props> = ({ player, className: outerClassName, mover }) => {
  const { user: currentPlayer } = useAuth();
  console.log(player._id !== currentPlayer?._id);
  useResourcesNotify(
    player.resources?.white,
    'white',
    player._id !== currentPlayer?._id ? player.nickname : undefined,
  );
  useResourcesNotify(
    player.resources?.dark,
    'dark',
    player._id !== currentPlayer?._id ? player.nickname : undefined,
  );
  useResourcesNotify(
    player.resources?.lives,
    'lives',
    player._id !== currentPlayer?._id ? player.nickname : undefined,
  );
  useResourcesNotify(
    player.resources?.money,
    'money',
    player._id !== currentPlayer?._id ? player.nickname : undefined,
  );

  const className = cn(
    outerClassName,
    s.playerContainer,
    player.gameover && s.playerGameOver,
    player._id === mover && s.playerMover,
  );

  return (
    <Spin spinning={player.disconnected ?? false}>
      <div key={player._id} className={className}>
        <Badge count={player.hold} offset={[-20, 20]} className={s.playerHold}>
          <Tooltip placement="top" title={player.nickname} color={player.color}>
            <Avatar
              size={{ xs: 60, sm: 80, md: 100, lg: 110, xl: 120, xxl: 130 }}
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
              <div className={s.iconContainer}>{icon}</div>
            </Resource>
          ))}
        </div>
      </div>
    </Spin>
  );
};

export default PlayerRow;
