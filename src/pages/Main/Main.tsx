import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Input, Card } from 'antd';
import { useMutation } from '@apollo/client';
import Chat from '../../components/Chat/Chat';
import { UserRole } from '../../types';

import { AuthContext } from '../../context/auth';
import { UPDATE_NICKNAME, UpdateNickname, UpdateNicknameVariables } from '../../apollo';

import s from './Main.module.sass';

const Main = () => {
  const [mutation] = useMutation<UpdateNickname, UpdateNicknameVariables>(UPDATE_NICKNAME);
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const [isChange, setIsChange] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onFinish = (value: { nickname: string }) => {
    setIsChange(false);
    mutation({ variables: { nickname: value.nickname } });
  };

  const goToLobby = () => {
    history.push('/lobby');
  };

  const goToStatistic = () => {
    history.push('/statistic');
  };

  const goToAddCard = () => {
    history.push('/add-card');
  };

  return (
    <div className={s.contain}>
      {user && (
        <Card className={s.containCard}>
          <Form
            form={form}
            onFinish={onFinish}
            onChange={() => setIsChange(true)}
            className={s.form}
            initialValues={{
              nickname: user?.nickname
                ? user.nickname
                : `${user?.name.givenName} ${user?.name.familyName}`,
            }}
          >
            <Form.Item style={{ marginRight: 10 }} name="nickname" required>
              <Input allowClear />
            </Form.Item>
            <Button hidden={!isChange} type="default" htmlType="submit">
              Сохранить
            </Button>
          </Form>
          <Button onClick={goToLobby} type="primary">
            Лобби
          </Button>
          <Button onClick={goToStatistic} type="primary">
            Статистика
          </Button>
          {(user.role === UserRole.Admin || user.role === UserRole.Moderator) && (
            <Button onClick={goToAddCard} type="primary">
              Добавить карточки
            </Button>
          )}
          <Button onClick={logout} type="primary" danger>
            Выйти
          </Button>
        </Card>
      )}
      <Chat />
    </div>
  );
};

export default Main;
