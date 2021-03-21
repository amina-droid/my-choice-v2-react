import React, { FC, useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { JOIN_GAME, JoinGame, JoinGameVariables } from '../../apollo/queries/JoinGame';
import { ReactComponent as GameField } from './GameSVG.svg';
import StaticField from './StaticField';
import DreamFields from './DreamFields';
import LeaveGame from './LeaveGame/LeaveGame';

import s from './Game.module.sass';
import Chat from '../../components/Chat/Chat';
import PlayersTable from './PlayersTable/PlayersTable';
import ChangeResources from './ChangeResources/ChangeResources';
import Dice from './Dice/Dice';

export const COLORS = [
  '--game-green',
  '--game-blue',
  '--game-yellow',
  '--game-pink',
  '--game-violet',
  '--game-orange',
  '--game-grey',
  '--game-black',
];

const Game: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const [tableIsOpen, setTableIsOpen] = useState<boolean>(false);
  const history = useHistory();
  const { data, error } = useQuery<JoinGame, JoinGameVariables>(JOIN_GAME, {
    variables: {
      gameId: match.params.id,
    },
  });

  useEffect(() => {
    if (error) {
      message.error(error.message);
      history.push('/lobby');
    }
  }, [error, history]);

  if (!data) return null;

  const onClose = () => {
    setTableIsOpen(false);
  };

  console.log(data);

  const leaveGame = () => {
    console.log('dsd');
  };

  return (
    <div className={s.gameContainer}>
      <div className={s.header}>
        <Dice />
      </div>
      <div className={s.playersTableContainer}>
        <PlayersTable players={data.joinGame.players} />
      </div>
      <div className={s.actionsContainer}>
        <ChangeResources className={s.action} />
        <Popconfirm
          placement="right"
          title="Вы уверены что хотите выйти из игры?"
          onConfirm={() => {
            leaveGame();
          }}
          okText="Да"
          cancelText="Нет"
        >
          <div>
            <LeaveGame className={s.action} />
          </div>
        </Popconfirm>
        <Chat game={{ name: data?.joinGame.name, topic: data?.joinGame._id }} />
      </div>
      <div className={s.playingField}>
        <GameField />
      </div>
    </div>
  );
};

export default Game;
