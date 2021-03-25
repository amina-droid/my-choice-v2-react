import React, { FC } from 'react';
import { Avatar, Tooltip } from 'antd';

import { COLORS } from '../Game';
import Resource from './Resource';
import { JoinGame_joinGame_players } from '../../../apollo/queries/JoinGame';
import { ReactComponent as Lives } from '../Resources/Lives.svg';
import { ReactComponent as Like } from '../Resources/Like.svg';
import { ReactComponent as Dislike } from '../Resources/Dislike.svg';
import { ReactComponent as Money } from '../Resources/Money.svg';

import s from './PlayersTable.module.sass';

type PlayersTableProps = {
  players: JoinGame_joinGame_players[];
};

const PlayersTable: FC<PlayersTableProps> = ({ players }) => {
  return (
    <div>
      {players.map((player, index) => (
        <div key={player._id} className={s.playerContainer}>
          <Tooltip placement="top" title={player.nickname} color={`var(${COLORS[index]})`}>
            <Avatar
              src={player.avatar}
              className={s.avatar}
              style={{ borderColor: `var(${COLORS[index]})` }}
            />
          </Tooltip>
          <div className={s.resources}>
            <Resource
              className={s.resource}
              color={`var(${COLORS[index]})`}
              title="Белый социальный капитал"
              resource={player.resources?.white}
            >
              <Like />
            </Resource>
            <Resource
              className={s.resource}
              color={`var(${COLORS[index]})`}
              title="Черный социальный капитал"
              resource={player.resources?.dark}
            >
              <Dislike />
            </Resource>
            <Resource
              className={s.resource}
              color={`var(${COLORS[index]})`}
              title="Деньги"
              resource={player.resources?.money}
            >
              <Money />
            </Resource>
            <Resource
              className={s.resource}
              color={`var(${COLORS[index]})`}
              title="Жизни"
              resource={player.resources?.lives}
            >
              <Lives />
            </Resource>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersTable;
