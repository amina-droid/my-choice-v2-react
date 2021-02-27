import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { CommentOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';

import { useMutation, useQuery, useSubscription } from '@apollo/client';
import s from './Lobby.module.sass';
import Card from '../../shared/Card/Card';
import Chat from '../../components/Chat/Chat';
import {
  CREATE_GAME,
  CreateGame,
  CreateGameVariables,
  GET_ACTIVE_GAMES,
  GetActiveGames,
  UPDATE_ACTIVE_GAMES,
  UpdateActiveGames,
} from '../../apollo';

const { Title } = Typography;

type CreateGameValues = {
  gameName: string;
};

const Lobby = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const { data, loading, subscribeToMore } = useQuery<GetActiveGames>(GET_ACTIVE_GAMES);
  const [createGame] = useMutation<CreateGame, CreateGameVariables>(CREATE_GAME);

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

  const showModal = () => {
    setVisible(true);
  };

  const cancelModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleCreateGame = async (values: CreateGameValues) => {
    await createGame({
      variables: { name: values.gameName },
    });
    cancelModal();
  };

  return (
    <div>
      <Title className={s.title} level={1}>
        Лобби
      </Title>
      <div className={s.containCards}>
        {data?.getActiveGames.map(game => {
          return (
            <Card
              className={s.card}
              key={game._id}
              title={game.name}
              playersCount={game.players.length}
            />
          );
        })}
        <Button className={s.cardAdd} type="default" onClick={showModal}>
          <PlusOutlined />
        </Button>
        <Modal
          visible={visible}
          onCancel={cancelModal}
          destroyOnClose
          title="Создать игру"
          className={s.modalCreateGame}
          centered
          footer={
            <Button
              type="primary"
              onClick={() => {
                form.validateFields().then(handleCreateGame);
              }}
            >
              Создать
            </Button>
          }
        >
          <Form form={form}>
            <Form.Item name="gameName">
              <Input placeholder="Введите название игры" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Chat />
    </div>
  );
};

export default Lobby;
