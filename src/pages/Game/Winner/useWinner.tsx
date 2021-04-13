import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { Modal } from 'antd';
import { ACTIVE_PLAYER, ActivePlayer } from '../../../apollo';
import { useAuth } from '../../../context/auth';
import { UserSex } from '../../../types';

type WinnerProps = {
  winnerId?: string;
  gameId: string;
  onOk: () => void
}

const useWinner = ({ winnerId, gameId, onOk }: WinnerProps) => {
  const { user } = useAuth();
  const [winner, setWinner] = useState<ActivePlayer | null>();
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (winnerId) {
      const winnerPlayer = apolloClient.readFragment<ActivePlayer>({
        id: `Player:${winnerId}`,
        fragment: ACTIVE_PLAYER,
        fragmentName: 'ActivePlayer',
        variables: {
          gameId,
        },
      });

      setWinner(winnerPlayer);
    }
  }, [winnerId, gameId]);

  useEffect(() => {
    if (winner) {
      const isCurrentPlayer = user?._id === winner._id;
      const playerName = isCurrentPlayer ? 'Вы' : `Игрок ${winner.nickname}`;
      const message = isCurrentPlayer ? 'одержали' : winner.sex === UserSex.Female ? 'одержала' : 'одержал';
      Modal.info({
        title: 'Поздравляем!',
        onOk,
        content: (
          <div>
            <p>{playerName} {message} победу!</p>
          </div>
        ),
      });
    }
  }, [winner]);
};

export default useWinner;
