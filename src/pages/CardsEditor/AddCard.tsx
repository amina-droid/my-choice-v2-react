import React, { FC, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'antd/es/form/Form';

import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import message from 'antd/es/message';

import {
  CREATE_CHOICE,
  CreateChoice,
  CreateChoiceVariables,
  GET_CARDS,
  GetCards,
} from '../../apollo';
import CardFields, { normalizeChoices } from './CardFields';

import s from './CardsEditor.module.sass';

const AddCard: FC = () => {
  const [createChoice, {
    data, loading,
  }] = useMutation<CreateChoice, CreateChoiceVariables>(CREATE_CHOICE, {
    update: (cache, { data: createChoiceData }) => {
      if (!createChoiceData?.createChoicesCard) return;
      const options = {
        query: GET_CARDS,
      };
      const newCard = createChoiceData.createChoicesCard;
      const cachedCards = cache.readQuery<GetCards>(options);
      cache.writeQuery<GetCards>({
        ...options,
        data: {
          cards: [...(cachedCards?.cards || []), newCard],
        },
      });
    },
  });
  const [form] = useForm();

  useEffect(() => {
    if (data) {
      message.success(`Карточка ${data.createChoicesCard.typeName} сохранена`);
    }
  }, [data]);

  const onFinish = async (val: CreateChoiceVariables['input']) => {
    try {
      await createChoice({
        variables: {
          input: {
            ...val,
            choices: normalizeChoices(val.choices),
          },
        },
      });
      form.resetFields();
    } catch (e) {
      message.error('Произошла ошибка, попробуйте снова');
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Card
        className={s.card}
        title="Создание новой карточки"
        actions={[
          <Form.Item key="submit">
            <Button type="primary" htmlType="submit" loading={loading}>
              Сохранить
            </Button>
          </Form.Item>,
        ]}
      >
        <CardFields />
      </Card>
    </Form>
  );
};

export default AddCard;
