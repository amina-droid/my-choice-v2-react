import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';

import Button from 'antd/es/button';
import Input from 'antd/es/input';
import message from 'antd/es/message';
import Modal from 'antd/es/modal';
import Select from 'antd/es/select';
import Switch from 'antd/es/switch';
import Form from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';

import {
  CREATE_GAME,
  CreateGame,
  CreateGameVariables,
  GET_TOURNAMENTS,
  GetActiveGames,
  GetTournaments,
} from '../../apollo';
import Card from '../../shared/Card/Card';
import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import { UserRole } from '../../types';
import { formicObsceneValidator } from '../../utils/obsceneFilter';

import s from './Lobby.module.sass';

type CreateGameValues = {
  gameName: string;
  observerMode?: boolean;
  tournament?: string;
};

const ModeratorFields = withAccess(
  [UserRole.Moderator],
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

type ModeratorFieldCreateGameProps = {
  showModal: () => void;
};

const ModeratorFieldCreateGame = withAccess<ModeratorFieldCreateGameProps>(
  [UserRole.Moderator],
)(({ showModal }) => {
  return (
    <Card onClick={showModal} className={s.cardAdd}>
      <PlusOutlined />
    </Card>
  );
});

type GamesProps = {
  activeGames?: GetActiveGames['getActiveGames'];
  clearAlerts?: () => void;
  isOnlineGame?: boolean;
};

const Games: FC<GamesProps> = ({
  activeGames,
  isOnlineGame,
  clearAlerts,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();

  const [
    createGame,
    {
      loading: createGameLoading,
    }] = useMutation<CreateGame, CreateGameVariables>(CREATE_GAME);
  const history = useHistory();
  useQuestionary();

  const cancelModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const redirectToGame = (id: string) => {
    history.push(`/game/${id}`);
    clearAlerts?.();
  };

  const showModal = () => {
    clearAlerts?.();
    setVisible(true);
  };

  const handleCreateGame = async (values: CreateGameValues) => {
    form.resetFields();
    try {
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
    } catch (e) {
      message.error(e.message);
      cancelModal();
    }
  };

  return (
    <div className={s.containCards}>
      {isOnlineGame ? (
        <Card onClick={showModal} className={s.cardAdd}>
          <PlusOutlined />
        </Card>
      ) : (
        <ModeratorFieldCreateGame showModal={showModal} />
      )}
      {activeGames?.map(game => {
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
            loading={createGameLoading}
            onClick={() => {
              form.validateFields().then(handleCreateGame);
            }}
          >
            Создать
          </Button>
        }
      >
        <Form form={form}>
          <Form.Item
            name="gameName"
            rules={[
              {
                required: true,
                message: 'Введите название игры',
              },
              formicObsceneValidator,
            ]}
          >
            <Input placeholder="Введите название игры" maxLength={23} />
          </Form.Item>
          {!isOnlineGame && <ModeratorFields />}
        </Form>
      </Modal>
    </div>
  );
};

export default Games;
