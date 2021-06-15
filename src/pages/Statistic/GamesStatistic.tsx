import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Select } from 'antd';

import {
  GET_TOURNAMENTS,
  GET_TOURNAMENTS_STATISTIC,
  GetTournaments,
  GetTournamentsStatistic,
  GetTournamentsStatisticVariables,
} from 'api/apollo/queries';
import { paginationModel } from 'utils/PaginationModel';

import { StatisticTable } from './StatisticTable';
import s from './Statistic.module.sass';

const { Option } = Select;

const DEFAULT_SELECT = {
  _id: 'none',
  name: 'Сетевые игры',
};

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_CURRENT_PAGE_SIZE = 10;

type State = {
  tournamentId: string;
  currentPage: number;
  currentPageSize: number;
};

const initialState: State = {
  tournamentId: DEFAULT_SELECT._id,
  currentPage: DEFAULT_CURRENT_PAGE,
  currentPageSize: DEFAULT_CURRENT_PAGE_SIZE,
};

const getTournamentIdVariable = (tournamentId: string) => {
  return tournamentId === DEFAULT_SELECT._id ? null : tournamentId;
};

const GamesStatistic: FC = () => {
  const [state, setState] = useState<State>(initialState);
  const { data, loading } = useQuery<GetTournaments>(GET_TOURNAMENTS);
  const [fetchStatistic, { data: statistic, loading: statisticLoading }] = useLazyQuery<
    GetTournamentsStatistic,
    GetTournamentsStatisticVariables
  >(GET_TOURNAMENTS_STATISTIC);

  const title = useMemo(() => {
    return (
      data?.tournaments.find(({ _id }) => _id === state.tournamentId)?.name || DEFAULT_SELECT.name
    );
  }, [state.tournamentId, data]);

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number = DEFAULT_CURRENT_PAGE_SIZE) => {
      setState(prevState => ({
        ...prevState,
        currentPageSize: pageSize,
        currentPage: page,
      }));
    },
    [state],
  );

  useEffect(() => {
    const pagination = paginationModel(state.currentPage, state.currentPageSize);
    fetchStatistic({
      variables: {
        tournamentId: getTournamentIdVariable(state.tournamentId),
        offset: pagination.offset,
        limit: pagination.limit,
      },
    });
  }, [state]);

  const handlerChange = useCallback((value: string) => {
    setState({
      tournamentId: value,
      currentPage: DEFAULT_CURRENT_PAGE,
      currentPageSize: DEFAULT_CURRENT_PAGE_SIZE,
    });
  }, []);

  const pagination = useMemo(
    () => ({
      total: statistic?.tournamentGames.totalCount,
      defaultCurrent: 1,
      showSizeChanger: false,
      current: state.currentPage,
      onChange: handlePaginationChange,
      size: 'small' as const,
      position: ['bottomLeft' as const],
    }),
    [statistic, handlePaginationChange],
  );

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
          <Option value={tournament._id} key={tournament._id}>
            {tournament.name}
          </Option>
        ))}
      </Select>
      <StatisticTable
        games={statistic?.tournamentGames.games}
        loading={statisticLoading}
        title={title}
        pagination={pagination}
      />
    </>
  );
};

export default GamesStatistic;
