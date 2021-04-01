import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Button, message, Modal, notification, Popconfirm, Spin } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CHOICE_DREAM,
  ChoiceDream,
  ChoiceDreamVariables,
  GAME_MOVE,
  GameMove,
  GameMoveVariables,
  JOIN_GAME,
  JoinGame,
  JoinGameVariables,
  LEAVE_GAME,
  LeaveGame as TLeaveGame,
  START_GAME,
  StartGame,
  StartGameVariables,
  UPDATE_ACTIVE_GAME,
  UpdateActiveGame,
  UpdateActiveGameVariables,
} from '../../apollo';

import LeaveGame from './LeaveGame/LeaveGame';

import s from './Game.module.sass';
import Chat from '../../components/Chat/Chat';
import PlayersTable from './PlayersTable/PlayersTable';
import ChangeResources from './ChangeResources/ChangeResources';
import CardModal from './CardModal/CardModal';
import Dice from './Dice/Dice';
import { AuthContext } from '../../context/auth';
import { GameStatus } from '../../types';
import GameField from './GameField/GameField';
import useNotificationTimeout from '../../utils/useNotificationTimeout';

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

function closePage(onOk: () => void) {
  return (e: BeforeUnloadEvent) => {
    Modal.confirm({
      title: 'Выход',
      cancelText: 'Нет',
      okText: 'Да',
      closable: true,
      content: (
        <div>
          <p>Вы уверены что хотите выйти из игры?</p>
        </div>
      ),
      onOk,
    });
    e.preventDefault();
    e.returnValue = 'Are you sure you want to close?';
  };
}

function changePage(onOk: () => void) {
  return (e: PopStateEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    window.history.pushState(null, 'Мой выбор: игровая сессия', location.href);
    // eslint-disable-next-line no-restricted-globals
    window.history.go(1);
    Modal.confirm({
      title: 'Выход',
      cancelText: 'Нет',
      okText: 'Да',
      closable: true,
      content: (
        <div>
          <p>Вы уверены что хотите выйти из игры?</p>
        </div>
      ),
      onOk,
    });
  };
}

const Game: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [callDiceAlert, clearDiceAlert] = useNotificationTimeout(
    'dice',
    'Ваш ход!',
    'Кидайте кубик',
  );
  const [callDreamAlert, clearDreamAlert] = useNotificationTimeout(
    'dream',
    'Игра началась!',
    'Выберите мечту',
  );
  const [callStartGameAlert, clearStartGameAlert] = useNotificationTimeout(
    'startGame',
    'Вы можете начать игру.',
    'Если все игроки собрались, нажмите на кнопку "Начать игру"',
  );
  const [leaveGameReq] = useMutation<TLeaveGame>(LEAVE_GAME);
  const [choiceDream] = useMutation<ChoiceDream, ChoiceDreamVariables>(CHOICE_DREAM);
  const [startGameReq] = useMutation<StartGame, StartGameVariables>(START_GAME);
  const [visible, setVisible] = useState<boolean>(false);
  const [joinGameReq, { data, error, subscribeToMore }] = useLazyQuery<JoinGame, JoinGameVariables>(
    JOIN_GAME,
    {
      fetchPolicy: 'cache-first',
      variables: {
        gameId: match.params.id,
      },
    },
  );
  const [moveReq] = useMutation<GameMove, GameMoveVariables>(GAME_MOVE);

  useEffect(() => {
    const listener = closePage(leaveGameReq);
    window.addEventListener('beforeunload', listener);

    return () => window.removeEventListener('beforeunload', listener);
  }, []);

  useEffect(() => {
    const listener = changePage(leaveGameReq);
    window.addEventListener('popstate', listener);

    return () => window.removeEventListener('popstate', listener);
  }, []);

  useEffect(() => {
    joinGameReq();
  }, [match.params.id]);

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

  useEffect(() => {
    if (data?.joinGame.mover) {
      callDiceAlert();
    }
  }, [data?.joinGame.mover]);

  useEffect(() => {
    if (data?.joinGame.status === GameStatus.ChoiceDream) {
      callDreamAlert();
    }
  }, [data?.joinGame.status]);

  useEffect(() => {
    if (data?.joinGame.status === GameStatus.Awaiting) {
      callStartGameAlert();
    }
  }, [data?.joinGame.status]);

  const leaveGame = async () => {
    history.push('/lobby');
    await leaveGameReq();
  };

  const startGame = (id: string) => {
    startGameReq({ variables: { gameId: id } });
  };

  const gameMove = (move: number) => {
    clearDiceAlert();
    moveReq({
      variables: {
        move,
      },
    });
  };

  const handleChoiceDream = (id: number) => {
    clearDreamAlert();
    choiceDream({ variables: { dream: id } });
  };

  if (!data?.joinGame) return <Spin size="large" />;
  const { creator, status, mover, name: gameName, _id: gameId } = data.joinGame;

  const handleDiceRollComplete = () => {
    setVisible(true);
  };

  const handleStartGame = (id: string) => {
    clearStartGameAlert();
    startGame(id);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <div className={s.gameContainer}>
      <CardModal gameId={match.params.id} visible={visible} closeModal={closeModal} />
      <div className={s.header}>
        {status === GameStatus.Awaiting && creator === user?._id && (
          <Button type="primary" onClick={() => handleStartGame(gameId)}>
            Начать игру
          </Button>
        )}
        {status === GameStatus.InProgress && (
          <Dice
            ready={mover === user?._id}
            onRoll={gameMove}
            onRollComplete={handleDiceRollComplete}
          />
        )}
      </div>
      <div className={s.playersTableContainer}>
        <PlayersTable players={data.joinGame.players} />
      </div>
      <div className={s.actionsContainer}>
        <ChangeResources className={s.action} />
        <Popconfirm
          placement="right"
          title="Вы уверены что хотите выйти из игры?"
          onConfirm={leaveGame}
          okText="Да"
          cancelText="Нет"
        >
          <div>
            <LeaveGame className={s.action} />
          </div>
        </Popconfirm>
        <Chat game={{ name: gameName, topic: gameId }} />
      </div>
      <div className={s.playingField}>
        <GameField game={data.joinGame} onChoiceDream={handleChoiceDream} />
      </div>
    </div>
  );
};

export default Game;
