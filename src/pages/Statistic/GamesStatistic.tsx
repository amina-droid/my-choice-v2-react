import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import Select from 'antd/es/select';

import {
  GET_TOURNAMENTS,
  GET_TOURNAMENTS_STATISTIC,
  GetTournaments,
  GetTournamentsStatistic,
  GetTournamentsStatisticVariables,
} from '../../apollo';

import { StatisticTable } from './StatisticTable';
import s from './Statistic.module.sass';

const { Option } = Select;

const DEFAULT_SELECT = {
  _id: 'none',
  name: 'Сетевые игры',
};

const GamesStatistic: FC = () => {
  const [tournamentId, setTournamentId] = useState(DEFAULT_SELECT._id);
  const { data, loading } = useQuery<GetTournaments>(GET_TOURNAMENTS);
  const [
    fetchStatistic, { data: statistic, loading: statisticLoading },
    ] = useLazyQuery<GetTournamentsStatistic, GetTournamentsStatisticVariables>(
      GET_TOURNAMENTS_STATISTIC,
  );

  const title = useMemo(() => data?.tournaments
    .find(({ _id }) => _id === tournamentId)?.name || DEFAULT_SELECT.name,
    [tournamentId, data]);

  useEffect(() => {
    fetchStatistic({
      variables: {
        tournamentId: tournamentId === DEFAULT_SELECT._id ? null : tournamentId,
      },
    });
  }, [tournamentId]);

  const handlerChange = useCallback((value: string) => {
    setTournamentId(value);
  }, []);

  console.log(statistic);
  return (
    <>
      <Select
        loading={loading}
        defaultValue={DEFAULT_SELECT._id}
        placeholder="Выберите тип игр"
        onChange={handlerChange}
        className={s.select}
      >
        <Option value={DEFAULT_SELECT._id}>{DEFAULT_SELECT.name}</Option>
        {data?.tournaments.map(tournament => (
          <Option value={tournament._id} key={tournament._id}>{tournament.name}</Option>
        ))}
      </Select>
      <StatisticTable
        games={statistic?.tournamentGames}
        loading={statisticLoading}
        title={title}
      />
    </>
  );
};

export default GamesStatistic;
