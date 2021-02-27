import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { useMutation } from '@apollo/client';

import { AuthContext } from '../../context/auth';
import { UPDATE_NICKNAME, UpdateNickname, UpdateNicknameVariables } from '../../apollo';
import Card from '../../shared/Card/Card';

import s from './Main.module.sass';

const Main = () => {
  const [mutation, { data, loading }] = useMutation<UpdateNickname, UpdateNicknameVariables>(
    UPDATE_NICKNAME,
  );
  const { user } = useContext(AuthContext);
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
        </Card>
      )}
    </div>
  );
};

export default Main;
