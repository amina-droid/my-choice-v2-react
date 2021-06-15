import React, { FC } from 'react';
import { useMutation } from '@apollo/client';

import Button from 'antd/es/button';
import Form from 'antd/es/form';
import message from 'antd/es/message';
import { useForm } from 'antd/es/form/Form';

import {
  NewCard,
  UPDATE_CHOICES_CARD,
  UpdateChoicesCard,
  UpdateChoicesCardVariables,
} from 'api/apollo';

import CardFields, { normalizeChoices } from './CardFields';

import s from './CardsEditor.module.sass';

type EditCardProps = {
  card?: NewCard;
  onComplete?: () => void;
};

const EditCard: FC<EditCardProps> = ({ card, onComplete }) => {
  const [updateChoicesCard, {
    loading,
  }] = useMutation<UpdateChoicesCard, UpdateChoicesCardVariables>(
    UPDATE_CHOICES_CARD,
  );
  const [form] = useForm();

  const onFinish = async (values: UpdateChoicesCardVariables['updateChoicesCard']) => {
    if (!card) return;
    try {
      await updateChoicesCard({
        variables: {
          cardId: card._id,
          updateChoicesCard: {
            description: values.description,
            choices: normalizeChoices(values.choices),
          },
        },
      });
      form.resetFields();
      onComplete?.();
    } catch (e) {
      message.error('Произошла ошибка, попробуйте снова');
    }
  };

  return (
    <Form form={form} initialValues={card} onFinish={onFinish}>
      <CardFields />
      <Form.Item key="submit">
        <Button type="primary" htmlType="submit" loading={loading} className={s.submitButton}>
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCard;
