import React, { FC, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Spin, Statistic } from 'antd';
import { GET_STATISTIC, GetStatistic } from '../../apollo';

import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import { UserRole } from '../../types';
import { useAuth } from '../../context/auth';

import { StatisticTable } from './StatisticTable';
import { GamesStatistic, gamesToStatistic } from './utils';
import s from './Statistic.module.sass';

const StatisticPage = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<GetStatistic>(GET_STATISTIC);

  const statistic: GamesStatistic | undefined = useMemo(
    () => gamesToStatistic(data?.games, user),
    [data, user?._id],
  );

  if (loading) {
    return (
      <div className={s.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data?.games) {
    return (
      <div className={s.container}>
        Вы еще не поучаствовали ни в одной из игр
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.shortStat}>
        <Card>
          <Statistic
            className={s.statItem}
            title="Сыграно игр"
            value={data?.games.length}
          />
        </Card>
        <Card>
          <Statistic
            className={s.statItem}
            title="Одержано побед"
            value={statistic?.winCount}
          />
        </Card>
        <Card>
          <Statistic
            className={s.statItem}
            title="Участие в турнирах"
            value={statistic?.tournamentCount}
          />
        </Card>
      </div>
      {statistic?.categories && (
        <div>
          {Object.entries(statistic?.categories).map(([
            tournamentId,
            games,
          ]) => (
            <StatisticTable
              key={tournamentId}
              games={games}
              title={statistic?.tournamentsConfig.get(tournamentId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withAccess([UserRole.User], true)(StatisticPage);
