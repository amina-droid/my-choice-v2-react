import React, { ComponentProps, FC } from 'react';
import moment from 'moment';
import { Avatar, Table, Typography } from 'antd';

import { StatisticGame } from './utils';
import s from './Statistic.module.sass';

type TableProps = {
  title?: string;
  games: StatisticGame[]
}

const getUserRow = (nullMessage: string) => (user: any) => {
  if (!user) return nullMessage;
  return (
    <span>
      <Avatar src={user?.photos[0].url} className={s.avatar} />
      {user?.nickname}
    </span>
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
      return (<span>{date.format('Do MMMM YYYY, в HH:mm')}</span>);
    },
  },
  {
    title: 'Участники',
    dataIndex: 'players',
    key: 'players',
    width: 400,
    render: (players: StatisticGame['players']) => (
      <div className={s.players}>
        {players.map(getUserRow('Игрок не найден'))}
      </div>
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

export const StatisticTable: FC<TableProps> = ({ title, games }) => {
  return (
    <div className={s.tableContainer}>
      <Typography.Title level={3}>{title || ''}</Typography.Title>
      <Table
        columns={columns}
        dataSource={games}
        bordered
        scroll={{ x: 900 }}
        pagination={{ pageSizeOptions: ['10'] }}
      />
    </div>
  );
};
