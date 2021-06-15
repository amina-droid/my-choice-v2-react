import React, { FC } from 'react';
import cn from 'classnames';
import { useMutation } from '@apollo/client';

import message from 'antd/es/message';
import Popconfirm from 'antd/es/popconfirm';
import Typography from 'antd/es/typography';

import {
  DELETE_GAME,
  DeleteGame,
  DeleteGameVariables,
  GetActiveGames_getActiveGames,
} from 'api/apollo';

import { GameStatus, UserRole } from 'types';
import { withAccess } from '../AccessHOC/AccessHOC';
import CloseButton from '../CloseButton/CloseButton';

import s from './Card.module.sass';

const { Title } = Typography;

const GAME_STATUS_DICTIONARY = {
  [GameStatus.Awaiting]: 'В ожидании игроков',
  [GameStatus.InProgress]: 'В процессе',
  [GameStatus.ChoiceDream]: 'В процессе',
  [GameStatus.Finished]: 'Игра окончена',
};

type CardProps = {
  game?: GetActiveGames_getActiveGames;
  className?: string;
  onClick?: () => void;
};

const Card: FC<CardProps> = ({ game, className, onClick, children }) => {
  const classNames = cn(
    className,
    s.containMain,
    game?.status && game.status === GameStatus.Finished && s.cardFinished,
  );
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames}
      disabled={Boolean(game?.status === GameStatus.Finished)}
    >
      {game && (
        <>
          <div
            className={cn(
              s.contain,
              (game.status === GameStatus.InProgress || game.status === GameStatus.ChoiceDream) &&
                s.containContentUnhover,
            )}
          >
            {game.status === GameStatus.Finished && <ModeratorFields gameId={game._id} />}
            {game.status && (
              <span
                className={cn(
                  s.status,
                  game.status === GameStatus.Finished && s.statusFinished,
                  game.status === GameStatus.Awaiting && s.statusAwaiting,
                  game.status !== GameStatus.Awaiting && s.statusNotAwaiting,
                )}
              >
                {GAME_STATUS_DICTIONARY[game.status]}
              </span>
            )}
            <Title level={3} className={s.nameGame}>
              {game.name}
            </Title>
            <span className={s.playersCount}>
              Подключено: {game.playersCount ? game.playersCount : 0}
            </span>
          </div>
          {(game.status === GameStatus.InProgress || game.status === GameStatus.ChoiceDream) && (
            <div className={cn(s.contain, s.containContentHover)}>Войти как наблюдатель</div>
          )}
        </>
      )}

      {children}
    </button>
  );
};

type ModeratorFieldsProps = {
  gameId: DeleteGameVariables['gameId'];
};

const ModeratorFields = withAccess<ModeratorFieldsProps>(
  [UserRole.Moderator],
)(({ gameId }) => {
  const [removeGame] = useMutation<DeleteGame, DeleteGameVariables>(DELETE_GAME);

  const deleteGame = async () => {
    try {
      await removeGame({ variables: { gameId } });
    } catch {
      message.error('Произошла ошибка, попробуйте снова');
    }
  };

  return (
    <>
      <Popconfirm
        placement="top"
        title="Вы уверены что хотите удалить игру?"
        onConfirm={deleteGame}
        okText="Да"
        cancelText="Нет"
      >
        <div>
          <CloseButton className={s.closeBtn} />
        </div>
      </Popconfirm>
    </>
  );
});

export default Card;
