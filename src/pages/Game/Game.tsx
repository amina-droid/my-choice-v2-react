import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { withOrientationChange } from 'react-device-detect';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import cn from 'classnames';

import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import message from 'antd/es/message';
import Popconfirm from 'antd/es/popconfirm';
import Typography from 'antd/es/typography';
import Spin from 'antd/es/spin';

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
import DreamTimer from './DreamTimer/DreamTimer';
import useNotificationTimeout from '../../utils/useNotificationTimeout';
import useClosePage from '../../utils/useClosePage';

import s from './Game.module.sass';

const DICE_NOTIFICATION_OPTIONS = {
  key: 'dice',
  timeoutMessage: 'Ваш ход!',
  description: 'Кидайте кубик',
  timeout: 5_500,
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

const useJoinGame = (
  gameId: string,
  onError?: (error: ApolloError | Error) => void,
) => {
  const [fetchJoinGame, { data, subscribeToMore }] = useLazyQuery<JoinGame, JoinGameVariables>(
    JOIN_GAME,
    {
      fetchPolicy: 'cache-first',
      onError,
    },
  );

  useEffect(() => {
    if (gameId) {
      fetchJoinGame({
        variables: {
          gameId,
        },
      });
    }
  }, [gameId]);

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
      onError,
      variables: { gameId },
      document: UPDATE_ACTIVE_GAME,
    });

    return () => unsubscribe();
  }, [subscribeToMore, gameId]);

  return data?.joinGame;
};

type GamePageProps = RouteComponentProps<{ gameId: string }>
type GameDeviceProps = {
  isPortrait: boolean;
  isLandscape: boolean;
}

type GameProps= GameDeviceProps & GamePageProps;

const Game: FC<GameProps> = ({ match, isPortrait }) => {
  const history = useHistory();
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
  const [fetchLeaveGame] = useMutation<TLeaveGame, LeaveGameVariables>(LEAVE_GAME, {
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
    await fetchLeaveGame({ variables: { gameId } });
  }, [history, fetchLeaveGame]);

  const onGameError = useCallback(
    (error: ApolloError | Error) => {
      message.error(error.message);
      leaveGame();
    },
    [leaveGame],
  );

  const game = useJoinGame(gameId, onGameError);
  const [choiceDream] = useMutation<ChoiceDream, ChoiceDreamVariables>(CHOICE_DREAM, {
    onError: onGameError,
  });
  const [fetchStartGame] = useMutation<StartGame, StartGameVariables>(START_GAME, {
    onError: onGameError,
  });

  const [moveReq] = useMutation<GameMove, GameMoveVariables>(GAME_MOVE, {
    onError: onGameError,
  });
  const [callDiceAlert, clearDiceAlert] = useNotificationTimeout(DICE_NOTIFICATION_OPTIONS);
  const [callDreamAlert, clearDreamAlert] = useNotificationTimeout(DREAM_NOTIFICATION_OPTIONS);
  const [callStartGameAlert, clearStartGameAlert] = useNotificationTimeout(
    START_GAME_NOTIFICATION_OPTIONS,
  );
  useWinner({
    winnerId: game?.winner,
    onOk: leaveGame,
    gameId: game?._id,
  });
  useClosePage(leaveGame, LEAVE_PAGE_MODAL_PROPS);

  const isTimeoutDownDiceDisabled = useMemo(() => (
    game?.players.filter(({ disconnected }) => !disconnected).length || 0) > 1, [
    game?.players.length,
  ]);

  useEffect(() => {
    const { _id: id, name: title } = game || {};
    if (id && title) {
      addTopic({
        id,
        title,
      });
    }
    return () => removeTopic(id);
  }, [game?._id]);

  useEffect(() => {
    if (game?.mover === user?._id && game?.status === GameStatus.InProgress) {
      callDiceAlert();
    }
  }, [game?.mover, user?._id, game?.status]);

  const isPlayersExist = game?.players.length;

  useEffect(() => {
    const isPlayer = game?.players.some(player => player._id === user?._id);
    if (game?.status === GameStatus.ChoiceDream && isPlayer) {
      callDreamAlert();
    }
  }, [game?.status]);

  useEffect(() => {
    if (
      game?.status === GameStatus.Awaiting &&
      game?.creator === user?._id &&
      isPlayersExist
    ) {
      callStartGameAlert();
    }
  }, [game?.status, user?._id, isPlayersExist]);

  const startGame = (id: string) => {
    fetchStartGame({ variables: { gameId: id } });
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

  if (!game) return <Spin size="large" />;
  const { creator, status, mover } = game;

  const handleStartGame = (id: string) => {
    clearStartGameAlert();
    startGame(id);
  };

  const myResources = game.players.find(player => player._id === user?._id)?.resources;

  const containerClassName = cn(
    s.gameContainer,
    isPortrait && s.blur,
  );
  return (
    <>
      <Modal visible={isPortrait} footer={null} closable={false}>
        Поддержка мобильных устройств ограничена,
        переключите ориентацию на альбомную (включите
        автоповорот экрана и поверните устройство на 90°)
      </Modal>
      <div className={containerClassName}>
        <Rules visible={visibleRules} closeModal={closeRulesModal} />
        <CardModal
          serverTimer={game?.timers?.card}
          gameId={match.params.gameId}
          onError={onGameError}
        />
        <div className={s.header}>
          <Typography.Title level={3} className={s.gameName}>
            {game?.name}
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
          {status === GameStatus.ChoiceDream && (
            <DreamTimer
              serverTimer={game?.timers?.dream}
            />
          )}
          {status === GameStatus.InProgress && (
            <Dice
              ready={mover === user?._id}
              onRoll={gameMove}
              className={s.dice}
              isTimeoutDownDisabled={isTimeoutDownDiceDisabled}
              serverTimer={game?.timers?.dice}
            />
          )}
        </div>
        <div className={s.playersTableContainer}>
          <PlayersTable players={game?.players} mover={mover} />
        </div>
        <div className={s.actionsContainer}>
          <ChangeResources
            className={s.actionBtn}
            resources={myResources}
            iconClass={s.actionIcon}
          />
          <CheckRules className={s.actionBtn} onClick={openRulesModal} iconClass={s.actionIcon} />
          <Popconfirm
            placement="right"
            title="Вы уверены что хотите выйти из игры?"
            onConfirm={leaveGame}
            okText="Да"
            cancelText="Нет"
          >
            <div>
              <LeaveGame className={s.actionBtn} iconClass={s.actionIcon} />
            </div>
          </Popconfirm>
        </div>
        <div className={s.playingField}>
          <GameField game={game} onChoiceDream={handleChoiceDream} />
        </div>
      </div>
    </>
  );
};

export default withOrientationChange(Game);
