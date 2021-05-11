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
const OUTCOMING_QUESTIONARY_KEY = 'outcoming-questionary';

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
      const isCheckQuestionary = Boolean(localStorage.getItem(OUTCOMING_QUESTIONARY_KEY));
      const playerName = isCurrentPlayer ? 'Вы' : `Игрок ${winner.nickname}`;
      const message = isCurrentPlayer ? 'одержали' : winner.sex === UserSex.Female ? 'одержала' : 'одержал';
      localStorage.setItem(OUTCOMING_QUESTIONARY_KEY, 'true');
      Modal.info({
        title: 'Поздравляем!',
        onOk,
        content: (
          <div>
            <p>{playerName} {message} победу!</p>
            {isCheckQuestionary && (
              <>
                <p>Также вы можете пройти наш <a href="https://vk.com/away.php?to=https%3A%2F%2Fdocs.google.com%2Fforms%2Fd%2F18BASHV_xAWUctEg3KdejLZ1cvCE_bzMrfKY53Ie4rI8%2Fedit&cc_key=" target="_blank" rel="noreferrer"> второй опросник! </a></p>
              </>
            )}
          </div>
        ),
      });
    }
  }, [winner]);
};

export default useWinner;
