import React, { FC, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

import Spin from 'antd/es/spin';
import Statistic from 'antd/es/statistic';
import Card from 'antd/es/card';

import { GET_STATISTIC, GetStatistic, GetStatisticVariables } from '../../apollo';

import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import { UserRole } from '../../types';
import { useAuth } from '../../context/auth';

import { StatisticTable } from './StatisticTable';
import { GamesStatistic, gamesToStatistic } from './utils';
import s from './Statistic.module.sass';

type Props = {
  userId: string,
  title: React.ReactNode,
};

const StatisticPage: FC<Props> = ({ userId, title }) => {
  const { user } = useAuth();
  const [
    fetchStatistic,
    { data, loading, error },
    ] = useLazyQuery<GetStatistic, GetStatisticVariables>(GET_STATISTIC);

  useEffect(() => {
    fetchStatistic({
      variables: {
        userId,
      },
    });
  }, [userId]);

  const statistic: GamesStatistic | undefined = useMemo(
    () => gamesToStatistic(data?.games, userId || user?._id),
    [data, user?._id, userId],
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
      {title}
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

export default withAccess<Props>([UserRole.User], true)(StatisticPage);
