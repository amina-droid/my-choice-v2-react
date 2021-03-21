import React, { FC } from 'react';
import { Avatar, Tooltip } from 'antd';
import { JoinGame_joinGame_players } from '../../../apollo/queries/JoinGame';
import { ReactComponent as Lives } from '../Resources/Lives.svg';
import { ReactComponent as Like } from '../Resources/Like.svg';
import { ReactComponent as Dislike } from '../Resources/Dislike.svg';
import { ReactComponent as Money } from '../Resources/Money.svg';

import s from './PlayersTable.module.sass';
import { COLORS } from '../Game';

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
            <div className={s.resource}>
              <Tooltip
                placement="right"
                title="Белый социальный капитал"
                color={`var(${COLORS[index]})`}
              >
                <Like />
              </Tooltip>
              {player.resources?.white}
            </div>
            <div className={s.resource}>
              <Tooltip
                placement="right"
                title="Черный социальный капитал"
                color={`var(${COLORS[index]})`}
              >
                <Dislike />
              </Tooltip>
              {player.resources?.dark}
            </div>
            <div className={s.resource}>
              <Tooltip placement="right" title="Деньги" color={`var(${COLORS[index]})`}>
                <Money />
              </Tooltip>
              {player.resources?.money}
            </div>
            <div className={s.resource}>
              <Tooltip placement="right" title="Жизни" color={`var(${COLORS[index]})`}>
                <Lives />
              </Tooltip>
              {player.resources?.lives}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersTable;
