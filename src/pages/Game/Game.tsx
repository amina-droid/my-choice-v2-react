import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, message, Popconfirm, Spin, Typography } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
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
  LeaveGameVariables,
  START_GAME,
  StartGame,
  StartGameVariables,
  UPDATE_ACTIVE_GAME,
  UpdateActiveGame,
  UpdateActiveGameVariables,
} from '../../apollo';

import LeaveGame from './LeaveGame/LeaveGame';
import PlayersTable from './PlayersTable/PlayersTable';
import ChangeResources from './ChangeResources/ChangeResources';
import CheckRules from './CheckRules/CheckRules';
import CardModal from './CardModal/CardModal';
import Dice from './Dice/Dice';
import { useAuth } from '../../context/auth';
import { useChatContext } from '../../context/chat';
import { GameStatus } from '../../types';
import GameField from './GameField/GameField';
import Rules from '../../components/Rules';
import useWinner from './Winner/useWinner';
import useNotificationTimeout from '../../utils/useNotificationTimeout';
import useClosePage from '../../utils/useClosePage';
import useScreenOrientation from '../../utils/useScreenOrientation';

import s from './Game.module.sass';

const DICE_NOTIFICATION_OPTIONS = {
  key: 'dice',
  timeoutMessage: 'Ваш ход!',
  description: 'Кидайте кубик',
};
const DREAM_NOTIFICATION_OPTIONS = {
  key: 'dream',
  timeoutMessage: 'Игра началась!',
  description: 'Выберите мечту',
};
const START_GAME_NOTIFICATION_OPTIONS = {
  key: 'startGame',
  timeoutMessage: 'Вы можете начать игру.',
  description: 'Если все игроки собрались, нажмите на кнопку "Начать игру"',
};
const LEAVE_PAGE_MODAL_PROPS = {
  title: 'Выход',
  cancelText: 'Нет',
  okText: 'Да',
  closable: true,
  content: (
    <div>
      <p>Вы уверены что хотите выйти из игры?</p>
    </div>
  ),
};

const Game: FC<RouteComponentProps<{ gameId: string }>> = ({ match }) => {
  const history = useHistory();
  const orientation = useScreenOrientation();
  console.log({ orientation });
  const [visibleRules, setVisibleRules] = useState(false);
  const { addTopic, removeTopic } = useChatContext();
  const { user } = useAuth();
  const openRulesModal = useCallback(() => {
    setVisibleRules(true);
  }, [setVisibleRules]);
  const closeRulesModal = useCallback(() => {
    setVisibleRules(false);
  }, [setVisibleRules]);

  const { gameId } = match.params;

  const [leaveGameReq] = useMutation<TLeaveGame, LeaveGameVariables>(LEAVE_GAME, {
    update: cache => {
      cache.evict({
        id: `GameSession:${match.params.gameId}`,
        fieldName: 'players',
      });
      cache.gc();
    },
  });
  const leaveGame = useCallback(async () => {
    history.push('/lobby');
    await leaveGameReq({ variables: { gameId } });
  }, [history, leaveGameReq]);

  const onGameError = useCallback(
    (error: ApolloError | Error) => {
      message.error(error.message);
      leaveGame();
    },
    [leaveGame],
  );
  const [choiceDream] = useMutation<ChoiceDream, ChoiceDreamVariables>(CHOICE_DREAM, {
    onError: onGameError,
  });
  const [startGameReq] = useMutation<StartGame, StartGameVariables>(START_GAME, {
    onError: onGameError,
  });
  const [joinGameReq, { data, subscribeToMore }] = useLazyQuery<JoinGame, JoinGameVariables>(
    JOIN_GAME,
    {
      fetchPolicy: 'cache-first',
      onError: onGameError,
    },
  );
  const [moveReq] = useMutation<GameMove, GameMoveVariables>(GAME_MOVE, {
    onError: onGameError,
  });
  console.log({ timers: data?.joinGame.timers });
  const [callDiceAlert, clearDiceAlert] = useNotificationTimeout(DICE_NOTIFICATION_OPTIONS);
  const [callDreamAlert, clearDreamAlert] = useNotificationTimeout(DREAM_NOTIFICATION_OPTIONS);
  const [callStartGameAlert, clearStartGameAlert] = useNotificationTimeout(
    START_GAME_NOTIFICATION_OPTIONS,
  );
  useWinner({
    winnerId: data?.joinGame.winner,
    onOk: leaveGame,
    gameId: data?.joinGame._id,
  });
  useClosePage(leaveGame, LEAVE_PAGE_MODAL_PROPS);

  useEffect(() => {
    if (match.params.gameId) {
      joinGameReq({
        variables: {
          gameId: match.params.gameId,
        },
      });
    }
  }, [match.params.gameId]);

  useEffect(() => {
    const { _id: id, name: title } = data?.joinGame || {};
    if (id && title) {
      addTopic({
        id,
        title,
      });
    }
    return () => removeTopic(id);
  }, [data?.joinGame?._id]);

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
      onError: onGameError,
      variables: { gameId: match.params.gameId },
      document: UPDATE_ACTIVE_GAME,
    });

    return () => unsubscribe();
  }, [subscribeToMore, match.params.gameId]);

  useEffect(() => {
    if (data?.joinGame.mover === user?._id && data?.joinGame.status === GameStatus.InProgress) {
      callDiceAlert();
    }
  }, [data?.joinGame.mover, user?._id, data?.joinGame.status]);

  const isPlayersExist = data?.joinGame.players.length;

  useEffect(() => {
    const isPlayer = data?.joinGame.players.some(player => player._id === user?._id);
    if (data?.joinGame.status === GameStatus.ChoiceDream && isPlayer) {
      callDreamAlert();
    }
  }, [data?.joinGame.status]);

  useEffect(() => {
    if (
      data?.joinGame.status === GameStatus.Awaiting &&
      data?.joinGame.creator === user?._id &&
      isPlayersExist
    ) {
      callStartGameAlert();
    }
  }, [data?.joinGame.status, user?._id, isPlayersExist]);

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
  const { creator, status, mover, name: gameName } = data.joinGame;

  const handleStartGame = (id: string) => {
    clearStartGameAlert();
    startGame(id);
  };

  const myResources = data.joinGame.players.find(player => player._id === user?._id)?.resources;

  return (
    <>
      <div className={s.gameContainer}>
        <Rules visible={visibleRules} closeModal={closeRulesModal} />
        <CardModal gameId={match.params.gameId} onError={onGameError} />
        <div className={s.header}>
          <Typography.Title level={3} className={s.gameName}>
            {data.joinGame.name}
          </Typography.Title>
          {status === GameStatus.Awaiting && creator === user?._id && (
            <Button
              type="primary"
              disabled={Boolean(!isPlayersExist)}
              onClick={() => handleStartGame(gameId)}
              className={s.startGameBtn}
            >
              Начать игру
            </Button>
          )}
          {status === GameStatus.InProgress && (
            <Dice ready={mover === user?._id} onRoll={gameMove} />
          )}
        </div>
        <div className={s.playersTableContainer}>
          <PlayersTable players={data.joinGame.players} mover={mover} />
        </div>
        <div className={s.actionsContainer}>
          <ChangeResources
            className={s.actionBtn}
            resources={myResources}
            iconClass={s.actionIcon}
          />
          <CheckRules
            className={s.actionBtn}
            onClick={openRulesModal}
            iconClass={s.actionIcon}
          />
          <Popconfirm
            placement="right"
            title="Вы уверены что хотите выйти из игры?"
            onConfirm={leaveGame}
            okText="Да"
            cancelText="Нет"
          >
            <div>
              <LeaveGame
                className={s.actionBtn}
                iconClass={s.actionIcon}
              />
            </div>
          </Popconfirm>
        </div>
        <div className={s.playingField}>
          <GameField game={data.joinGame} onChoiceDream={handleChoiceDream} />
        </div>
      </div>
    </>
  );
};

export default Game;
