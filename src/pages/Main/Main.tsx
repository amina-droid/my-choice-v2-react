import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Card } from 'antd';
import { useMutation } from '@apollo/client';
import { CheckOutlined, EditOutlined } from '@ant-design/icons/lib';

import Chat from '../../components/Chat/Chat';
import { UserRole } from '../../types';

import { useAuth } from '../../context/auth';
import { UPDATE_NICKNAME, UpdateNickname, UpdateNicknameVariables } from '../../apollo';

import s from './Main.module.sass';

const Main = () => {
  const { user, logout } = useAuth();
  const [form] = Form.useForm();
  const [mutation] = useMutation<UpdateNickname, UpdateNicknameVariables>(UPDATE_NICKNAME, {
    update: (cache, mutationResult) => {
      if (!mutationResult.data?.updateNickname.nickname) return;
      cache.modify({
        id: cache.identify({
          __typename: 'User',
          _id: user?._id,
        }),
        fields: {
          nickname: () => {
            return mutationResult.data?.updateNickname.nickname;
          },
        },
      });
    },
  });
  const [isChange, setIsChange] = useState<boolean>(false);

  const onFinish = () => {
    const newNickname: string = form.getFieldValue('nickname');
    setIsChange(false);
    mutation({ variables: { nickname: newNickname.trim() } });
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
                suffix={isChange
                  ? <CheckOutlined className={s.icon} onClick={onFinish} />
                  : <EditOutlined className={s.icon} />}
              />
            </Form.Item>
          </Form>
          <Link to="/lobby">
            <Button type="primary" block>
              Лобби
            </Button>
          </Link>
          <Link to="/statistic">
            <Button type="primary" block>
              Статистика
            </Button>
          </Link>
          {(user.role === UserRole.Admin || user.role === UserRole.Moderator) && (
            <Link to="/add-card">
              <Button type="primary" block>
                Добавить карточки
              </Button>
            </Link>
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
