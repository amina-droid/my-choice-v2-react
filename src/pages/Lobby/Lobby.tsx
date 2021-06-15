import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useQuery } from '@apollo/client';

import Tabs from 'antd/es/tabs';

import {
  GET_ACTIVE_GAMES,
  GetActiveGames,
  UPDATE_ACTIVE_GAMES,
  UpdateActiveGames,
} from 'api/apollo';
import useNotificationTimeout from 'utils/useNotificationTimeout';

import Games from './Games';

import s from './Lobby.module.sass';

const { TabPane } = Tabs;

const LOBBY_NOTIFICATION_OPTIONS = {
  key: 'lobby',
  timeoutMessage: 'Добро пожаловать в игру!',
  description:
    'Здесь вы можете создать новую игровую комнату, нажав на "+", или присоединиться к уже существующей.',
};

const MOBILE_NOTIFICATION_OPTIONS = {
  key: 'mobile',
  timeoutMessage: 'Предупреждение',
  description:
    'Поддержка мобильных устройств ограничена',
  type: 'warning' as const,
  timeout: 0,
};

type LobbyGamesState = {
  netGames?: GetActiveGames['getActiveGames'];
  tournamentGames?: GetActiveGames['getActiveGames'];
};

const Lobby = () => {
  const [{ netGames, tournamentGames }, setGamesList] = useState<LobbyGamesState>({});
  const [callLobbyAlert, clearLobbyAlert] = useNotificationTimeout(LOBBY_NOTIFICATION_OPTIONS);
  const [callMobileAlert, clearMobileAlert] = useNotificationTimeout(MOBILE_NOTIFICATION_OPTIONS);
  const { subscribeToMore } = useQuery<GetActiveGames>(GET_ACTIVE_GAMES, {
    onCompleted(data) {
      setGamesList(
        data?.getActiveGames?.reduce<LobbyGamesState>(
          (acc, game) => {
            if (game.tournament) {
              acc.tournamentGames!.push(game);
            } else acc.netGames!.push(game);
            return acc;
          },
          {
            netGames: [],
            tournamentGames: [],
          },
        ) || {},
      );
    },
  });

  useEffect(() => {
    if (!subscribeToMore) return;
    subscribeToMore<UpdateActiveGames>({
      document: UPDATE_ACTIVE_GAMES,
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        if (!subscriptionData?.data) return previousQueryResult;
        return {
          getActiveGames: subscriptionData.data.updateActiveGames,
        };
      },
    });
  }, [subscribeToMore]);

  useEffect(() => {
    if (isMobile) {
      callMobileAlert();
    }
    callLobbyAlert();
  }, []);

  const clearAlerts = useCallback(() => {
    clearLobbyAlert();
    clearMobileAlert();
  }, [clearLobbyAlert, clearMobileAlert]);

  return (
    <div className={s.container}>
      <Tabs defaultActiveKey="OnlineGame" size="large" className={s.tab}>
        <TabPane tab={<span className={s.navItem}>Сетевые игры</span>} key="OnlineGame">
          <Games
            activeGames={netGames}
            clearAlerts={clearAlerts}
            isOnlineGame
          />
        </TabPane>
        <TabPane tab={<span className={s.navItem}>Чемпионат</span>} key="Сhampionship">
          <Games
            activeGames={tournamentGames}
            clearAlerts={clearAlerts}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Lobby;
