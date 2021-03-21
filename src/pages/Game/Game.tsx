import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  JOIN_GAME,
  JoinGame,
  JoinGameVariables,
  LEAVE_GAME,
  LeaveGame as TLeaveGame,
  UPDATE_ACTIVE_GAME,
  UpdateActiveGame,
  UpdateActiveGameVariables,
  START_GAME,
  StartGame,
  StartGameVariables,
  CHOICE_DREAM,
  ChoiceDream,
  ChoiceDreamVariables,
} from '../../apollo';

import LeaveGame from './LeaveGame/LeaveGame';

import s from './Game.module.sass';
import Chat from '../../components/Chat/Chat';
import PlayersTable from './PlayersTable/PlayersTable';
import ChangeResources from './ChangeResources/ChangeResources';
import Dice from './Dice/Dice';
import { AuthContext } from '../../context/auth';
import { GameStatus } from '../../types';
import GameField from './GameField/GameField';

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
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [leaveGameReq] = useMutation<TLeaveGame>(LEAVE_GAME);
  const [choiceDream] = useMutation<ChoiceDream, ChoiceDreamVariables>(CHOICE_DREAM);
  const [startGameReq] = useMutation<StartGame, StartGameVariables>(START_GAME);
  const [joinGame, { data, error, subscribeToMore }] = useLazyQuery<JoinGame, JoinGameVariables>(
    JOIN_GAME,
    {
      variables: {
        gameId: match.params.id,
      },
    },
  );

  useEffect(() => {
    joinGame();
  }, []);

  useEffect(() => {
    if (!subscribeToMore) return () => {};
    const unsubscribe = subscribeToMore<UpdateActiveGame, UpdateActiveGameVariables>({
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        if (!subscriptionData?.data?.updateActiveGame) return previousQueryResult;
        const newData = subscriptionData.data.updateActiveGame;

        return {
          joinGame: newData,
        };
      },
      variables: { gameId: match.params.id },
      document: UPDATE_ACTIVE_GAME,
    });

    return () => unsubscribe();
  }, [subscribeToMore, match.params.id]);

  useEffect(() => {
    if (error) {
      message.error(error.message);
      history.push('/lobby');
    }
  }, [error, history]);

  if (!data) return null;

  const leaveGame = async () => {
    history.push('/lobby');
    await leaveGameReq();
  };

  const startGame = (id: string) => {
    startGameReq({ variables: { gameId: id } });
  };

  const handleChoiceDream = (id: number) => {
    choiceDream({ variables: { dream: id } });
  };
  console.log(data.joinGame.status === GameStatus.InProgress);
  return (
    <div className={s.gameContainer}>
      <div className={s.header}>
        {data.joinGame.status === GameStatus.Awaiting && data.joinGame.creator === user?._id && (
          <Button type="primary" onClick={() => startGame(data?.joinGame._id)}>
            Начать игру
          </Button>
        )}
        {data.joinGame.status === GameStatus.InProgress && <Dice />}
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
        <GameField game={data.joinGame} onChoiceDream={handleChoiceDream} />
      </div>
    </div>
  );
};

export default Game;
