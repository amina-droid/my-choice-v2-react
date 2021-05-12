import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Switch, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useHistory } from 'react-router-dom';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import s from './Lobby.module.sass';
import Card from '../../shared/Card/Card';
import {
  CREATE_GAME,
  CreateGame,
  CreateGameVariables,
  GET_ACTIVE_GAMES,
  GET_TOURNAMENTS,
  GetActiveGames,
  GetTournaments,
  UPDATE_ACTIVE_GAMES,
  UpdateActiveGames,
} from '../../apollo';
import useNotificationTimeout from '../../utils/useNotificationTimeout';
import { withAccess } from '../../shared/AccessHOC/AccessHOC';
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

const ModeratorFields = withAccess(
  [UserRole.Moderator],
  false,
)(() => {
  const [visibleTournaments, setVisibleTournaments] = useState(false);
  const [getTournaments, { data, loading }] = useLazyQuery<GetTournaments>(GET_TOURNAMENTS);

  useEffect(() => {
    if (visibleTournaments) {
      getTournaments();
    }
  }, [visibleTournaments, getTournaments]);
  return (
    <>
      <Form.Item name="observerMode" label="Создать в роли наблюдателя">
        <Switch />
      </Form.Item>
      <Form.Item name="visibleTournaments" label="Турнирная игра">
        <Switch onChange={setVisibleTournaments} />
      </Form.Item>
      {visibleTournaments && (
        <Form.Item name="tournament" label="Выберете турнир">
          <Select loading={loading}>
            {data?.tournaments.map(tournament => (
              <Select.Option value={tournament._id} key={tournament._id}>
                {tournament.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </>
  );
});

const INCOMING_QUESTIONARY_KEY = 'incoming-questionary';
const useQuestionary = () => {
  useEffect(() => {
    if (!localStorage.getItem(INCOMING_QUESTIONARY_KEY)) {
      Modal.confirm({
        title: 'Пройдите наш опросник!',
        width: 600,
        content: (
          <>
            Дорогие друзья!
            <br />
            Мы проводим опрос, нацеленный на выявление значимого отношения к проявлениям и
            профилактике экстремизма в детско-подростковой и молодёжной среде. Ваши искренние ответы
            позволят получить и проанализировать социально значимую информацию, повысить
            эффективность принимаемых управленческих решений в сфере организации профилактики
            экстремистских проявлений в детско-подростковой и молодёжной среде.
            <br />
            Благодарим Вас за терпение и понимание!
          </>
        ),
        okText: 'Я готов пройти',
        cancelText: 'Нет, спасибо',
        closable: true,
        onOk() {
          window.open(
            'https://vk.com/away.php?to=https%3A%2F%2Fdocs.google.com%2Fforms%2Fd%2F1VdDf9xS0YSymxBvYT-SBESqcQYXfPGt4m1CqBzxP8io%2Fedit&cc_key=',
            '_blank',
          );
          localStorage.setItem(INCOMING_QUESTIONARY_KEY, 'true');
        },
        onCancel() {
          localStorage.setItem(INCOMING_QUESTIONARY_KEY, 'true');
        },
      });
    }
  }, []);
};

const Lobby = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const { data, subscribeToMore } = useQuery<GetActiveGames>(GET_ACTIVE_GAMES);
  const [createGame] = useMutation<CreateGame, CreateGameVariables>(CREATE_GAME);
  const [callLobbyAlert, clearLobbyAlert] = useNotificationTimeout(LOBBY_NOTIFICATION_OPTIONS);
  const history = useHistory();
  useQuestionary();

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
        tournament: values.tournament,
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
            game={game}
            key={game._id}
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
            <Input placeholder="Введите название игры" maxLength={25} />
          </Form.Item>
          <ModeratorFields />
        </Form>
      </Modal>
    </div>
  );
};

export default Lobby;
