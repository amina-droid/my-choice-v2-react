import React, { ComponentProps, FC } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import Avatar from 'antd/es/avatar';
import Table, { TablePaginationConfig } from 'antd/es/table';
import Title from 'antd/es/typography/Title';

import { Statistic as StatisticGame } from '../../apollo';
import s from './Statistic.module.sass';

type TableProps = {
  title?: string;
  loading?: boolean;
  games?: StatisticGame[];
  pagination?: TablePaginationConfig;
};

const getUserRow = (nullMessage: string) => (user: any) => {
  if (!user) return nullMessage;
  return (
    <Link to={`/statistic/${user._id}`}>
      <Avatar src={user?.photos[0].url} className={s.avatar} />
      {user?.nickname}
    </Link>
  );
};

const columns: ComponentProps<typeof Table>['columns'] = [
  {
    title: 'Название',
    dataIndex: 'name',
    width: 200,
    key: 'name',
  },
  {
    title: 'Дата начала',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 200,
    render: (createdAt: string) => {
      const date = moment(createdAt);
      return <span>{date.format('Do MMMM YYYY, в HH:mm')}</span>;
    },
  },
  {
    title: 'Участники',
    dataIndex: 'players',
    key: 'players',
    width: 400,
    render: (players: StatisticGame['players']) => (
      <div className={s.players}>{players.map(getUserRow('Игрок не найден'))}</div>
    ),
  },
  {
    title: 'Победитель',
    dataIndex: 'winner',
    key: 'winner',
    width: 400,
    render: getUserRow('Победителя нет'),
  },
];

export const StatisticTable: FC<TableProps> = ({
  title,
  games,
  loading,
  pagination = {
    pageSizeOptions: ['10'],
    size: 'small',
    showSizeChanger: false,
    position: ['bottomLeft'],
  },
}) => {
  return (
    <div className={s.tableContainer}>
      <Title level={3}>{title || ''}</Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={games}
        bordered
        scroll={{ x: 900 }}
        pagination={pagination}
      />
    </div>
  );
};
