import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useQuery } from '@apollo/client';
import {
  GET_ACTIVE_GAMES,
  GetActiveGames,
  UPDATE_ACTIVE_GAMES,
  UpdateActiveGames,
} from '../../apollo';
import Games from './Games';

import s from './Lobby.module.sass';

const { TabPane } = Tabs;

type LobbyGamesState = {
  netGames?: GetActiveGames['getActiveGames'];
  tournamentGames?: GetActiveGames['getActiveGames'];
};

const Lobby = () => {
  const [{ netGames, tournamentGames }, setGamesList] = useState<LobbyGamesState>({});
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

  return (
    <div className={s.container}>
      <Tabs defaultActiveKey="OnlineGame" size="large" className={s.tab}>
        <TabPane tab={<span className={s.navItem}>Сетевые игры</span>} key="OnlineGame">
          <Games activeGames={netGames} isOnlineGame />
        </TabPane>
        <TabPane tab={<span className={s.navItem}>Чемпионат</span>} key="Сhampionship">
          <Games activeGames={tournamentGames} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Lobby;
