import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import s from './Lobby.module.sass';
import Card from '../../shared/Card/Card';
import {
  CREATE_GAME,
  CreateGame,
  CreateGameVariables,
  GET_ACTIVE_GAMES,
  GetActiveGames,
  UPDATE_ACTIVE_GAMES,
  UpdateActiveGames,
} from '../../apollo';
import useNotificationTimeout from '../../utils/useNotificationTimeout';
import { withPageAccess } from '../../shared/PageAccessHOC/PageAccessHOC';
import { UserRole } from '../../types';

const LOBBY_NOTIFICATION_OPTIONS = {
  key: 'lobby',
  timeoutMessage: 'Добро пожаловать в игру!',
  description:
    'Здесь вы можете создать новую игровую комнату, нажав на "+", или присоединиться к уже существующей.',
};

type CreateGameValues = {
  gameName: string;
  observerMode?: boolean;
  tournament?: string;
};

const ModeratorFields = withPageAccess([UserRole.Moderator])(() => {
  const [visibleTournaments, setVisibleTournaments] = useState(false);
  return (
    <>
      <Form.Item name="observerMode" label="Создать в роли наблюдателя">
        <Switch />
      </Form.Item>
    </>
  );
});

const Lobby = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const { data, subscribeToMore } = useQuery<GetActiveGames>(GET_ACTIVE_GAMES);
  const [createGame] = useMutation<CreateGame, CreateGameVariables>(CREATE_GAME);
  const [callLobbyAlert, clearLobbyAlert] = useNotificationTimeout(LOBBY_NOTIFICATION_OPTIONS);
  const history = useHistory();

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
    callLobbyAlert();
  }, []);

  const showModal = () => {
    clearLobbyAlert();
    setVisible(true);
  };

  const cancelModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const redirectToGame = (id: string) => {
    history.push(`/game/${id}`);
    clearLobbyAlert();
  };

  const handleCreateGame = async (values: CreateGameValues) => {
    form.resetFields();
    const { data: res } = await createGame({
      variables: {
        name: values.gameName,
        observerMode: values.observerMode,
      },
    });
    if (!res?.createGame._id) return;
    cancelModal();
    redirectToGame(res.createGame._id);
    message.success('Игра создана');
  };

  return (
    <div className={s.containCards}>
      <Card onClick={showModal} className={s.cardAdd}>
        <PlusOutlined />
      </Card>
      {data?.getActiveGames.map(game => {
        return (
          <Card
            className={s.card}
            key={game._id}
            title={game.name}
            playersCount={game.playersCount}
            onClick={() => redirectToGame(game._id)}
          />
        );
      })}
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
          <Form.Item name="gameName" rules={[{ required: true, message: 'Введите название игры' }]}>
            <Input placeholder="Введите название игры" />
          </Form.Item>
          <ModeratorFields />
        </Form>
      </Modal>
    </div>
  );
};

export default Lobby;
