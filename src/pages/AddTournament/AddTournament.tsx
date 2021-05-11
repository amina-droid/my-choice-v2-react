import React from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useMutation } from '@apollo/client';
import { CREATE_TOURNAMENT, CreateTournament, CreateTournamentVariables } from '../../apollo';
import s from './AddTournament.module.sass';

const AddTournament = () => {
  const [form] = useForm();
  const [addTournament] = useMutation<CreateTournament, CreateTournamentVariables>(
    CREATE_TOURNAMENT,
  );

  const onFinish = async (values: CreateTournamentVariables) => {
    try {
      await addTournament({ variables: values });
      message.success('Турнир создан');
      form.resetFields();
    } catch {
      message.error('Произошла ошибка, попробуйте снова');
    }
  };
  return (
    <div className={s.container}>
      <Form form={form} onFinish={onFinish}>
        <Card
          className={s.card}
          title="Создание нового турнира"
          actions={[
            <Form.Item key="submit">
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
            </Form.Item>,
          ]}
        >
          <Form.Item name="name" label="Название турнира" labelAlign="left">
            <Input />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default AddTournament;
