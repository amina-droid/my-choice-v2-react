import React, { FC, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { JOIN_GAME, JoinGame, JoinGameVariables } from '../../apollo/queries/JoinGame';
import StaticField from './StaticField';
import DreamFields from './DreamFields';
import LeaveGame from './LeaveGame/LeaveGame';

import s from './Game.module.sass';
import Chat from '../../components/Chat/Chat';
import PlayersTable from './PlayersTable';
import CloseButton from '../../shared/CloseButton/CloseButton';
import ChangeResources from './ChangeResources/ChangeResources';
import Dice from './Dice/Dice';

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

  return (
    <div className={s.gameContainer}>
      <div className={s.header}>
        <Dice />
      </div>
      <div className={s.playersTableContainer}>
        <Button
          type="default"
          className={s.openTableBtn}
          hidden={tableIsOpen}
          onClick={() => setTableIsOpen(true)}
        >
          Таблица игроков
        </Button>
        <div className={s.table} hidden={!tableIsOpen}>
          <CloseButton onClose={onClose} className={s.closeBtn} />
          <PlayersTable data={data.joinGame.players} />
        </div>
      </div>
      <div className={s.actionsContainer}>
        <ChangeResources />
        <LeaveGame />
        <Chat game={{ name: data?.joinGame.name, topic: data?.joinGame._id }} />
      </div>
      <div className={s.playingField}>
        <svg
          className={s.svg}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1050 704"
        >
          <StaticField />
          <DreamFields />
        </svg>
      </div>
    </div>
  );
};

export default Game;
