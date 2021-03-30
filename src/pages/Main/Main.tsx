import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Input, Card } from 'antd';
import { useMutation } from '@apollo/client';
import { CheckOutlined, EditOutlined } from '@ant-design/icons/lib';

import Chat from '../../components/Chat/Chat';
import { UserRole } from '../../types';

import { AuthContext } from '../../context/auth';
import { UPDATE_NICKNAME, UpdateNickname, UpdateNicknameVariables } from '../../apollo';

import s from './Main.module.sass';

const Main = () => {
  const { user, logout } = useContext(AuthContext);
  const [mutation] = useMutation<UpdateNickname, UpdateNicknameVariables>(UPDATE_NICKNAME, {
    update: (cache, mutationResult) => {
      if (!mutationResult.data?.updateNickname.nickname) return;
      cache.modify({
        id: `User:${user?._id}`,
        fields: {
          nickname: () => mutationResult.data?.updateNickname.nickname,
        },
      });
    },
  });
  const history = useHistory();
  const [isChange, setIsChange] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onFinish = () => {
    console.log(form.getFieldValue('nickname'));
    setIsChange(false);
    // mutation({ variables: { nickname: value.nickname } });
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
            onChange={() => setIsChange(true)}
            className={s.form}
            form={form}
            initialValues={{
              nickname: user.nickname,
            }}
          >
            <Form.Item name="nickname" required>
              <Input
                maxLength={50}
                bordered={false}
                suffix={isChange ? <CheckOutlined onClick={onFinish} /> : <EditOutlined />}
              />
            </Form.Item>
          </Form>
          <Button onClick={goToLobby} type="primary" block>
            Лобби
          </Button>
          <Button onClick={goToStatistic} type="primary" block>
            Статистика
          </Button>
          {(user.role === UserRole.Admin || user.role === UserRole.Moderator) && (
            <Button onClick={goToAddCard} type="primary" block>
              Добавить карточки
            </Button>
          )}
          <Button onClick={logout} type="primary" danger block>
            Выйти
          </Button>
        </Card>
      )}
      <Chat />
    </div>
  );
};

export default Main;
