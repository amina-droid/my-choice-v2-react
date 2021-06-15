import React, { useEffect } from 'react';
import { Button, Input, message, Form, Card, List } from 'antd';
import Text from 'antd/es/typography/Text';
import CustomScroll from 'react-custom-scroll';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  GET_TOURNAMENTS,
  GetTournaments,
} from 'api/apollo/queries';
import {
  CREATE_TOURNAMENT,
  CreateTournament,
  CreateTournamentVariables,
} from 'api/apollo/mutations';

import s from './AddTournament.module.sass';

const { useForm } = Form;

const AddTournament = () => {
  const [form] = useForm();
  const [addTournament] = useMutation<CreateTournament, CreateTournamentVariables>(
    CREATE_TOURNAMENT,
  );
  const [getTournaments, { data, loading, refetch }] = useLazyQuery<GetTournaments>(
    GET_TOURNAMENTS,
  );

  useEffect(() => {
    getTournaments();
  }, []);

  const onFinish = async (values: CreateTournamentVariables) => {
    try {
      await addTournament({ variables: values });
      message.success('Турнир создан');
      form.resetFields();
      await refetch?.();
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
      <Card className={s.card} title="Созданные турниры">
        <CustomScroll allowOuterScroll keepAtBottom>
          <List
            loading={loading}
            className={s.cardsList}
            size="large"
            dataSource={data?.tournaments}
            renderItem={tournament => (
              <List.Item>
                <List.Item.Meta
                  description={
                    <Text
                      copyable={{
                        text: tournament._id,
                        tooltips: ['Скопировать ID', 'Скопировано!'],
                      }}
                    >
                      ID: {tournament._id}
                    </Text>
                  }
                  title={<>{tournament.name}</>}
                />
              </List.Item>
            )}
          />
        </CustomScroll>
      </Card>
    </div>
  );
};

export default AddTournament;
