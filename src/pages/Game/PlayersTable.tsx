import React, { FC } from 'react';
import { Avatar, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { JoinGame } from '../../apollo/queries/JoinGame';

import s from './Game.module.sass';

const { TabPane } = Tabs;

type Player = JoinGame['joinGame']['players'][0];
const columns: ColumnsType<Player> = [
  {
    render: (player: Player) => <Avatar size={50} src={player.avatar} />,
    key: 'avatar',
  },
  {
    title: 'Игрок',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: 'СК (Б)',
    dataIndex: ['resources', 'white'],
    render: white => white ?? '—',
    key: 'white',
    width: 60,
    align: 'center',
  },
  {
    title: 'СК (Ч)',
    dataIndex: ['resources', 'dark'],
    render: dark => dark ?? '—',
    key: 'dark',
    width: 60,
    align: 'center',
  },
  {
    title: '₽',
    dataIndex: ['resources', 'money'],
    render: money => money ?? '—',
    key: 'money',
    width: 60,
    align: 'center',
  },
  {
    title: 'Жизни',
    dataIndex: ['resources', 'lives'],
    render: lives => lives ?? '—',
    key: 'lives',
    width: 60,
    align: 'center',
  },
];

type PlayersTableProps = {
  data: Player[];
};

const PlayersTable: FC<PlayersTableProps> = ({ data }) => {
  return (
    <>
      <Tabs type="card" className={s.tabs}>
        <TabPane tab="Таблица игроков" key="1" className={s.tab}>
          <Table columns={columns} dataSource={data} bordered pagination={false} size="small" />
        </TabPane>
      </Tabs>
    </>
  );
};

export default PlayersTable;
