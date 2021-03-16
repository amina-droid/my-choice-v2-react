import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Card, Form, InputNumber, message, Select, Space, Typography } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { FieldType } from '../../types';

import s from './CardsEditor.module.sass';
import { CREATE_CHOICE, CreateChoice, CreateChoiceVariables } from '../../apollo';
import { FIELD_DICTIONARY } from './CardsEditor';
import { GET_CARDS, GetCards } from '../../apollo/queries/GetCards';

const CHOICES_CARD = [FieldType.Dream, FieldType.Situation, FieldType.Reaction, FieldType.Offer];

const AddCard = () => {
  const [createChoice, { data }] = useMutation<CreateChoice, CreateChoiceVariables>(CREATE_CHOICE, {
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
      await createChoice({ variables: { input: val } });
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
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>,
        ]}
      >
        <Form.Item name="type" label="Тип карточки" labelAlign="left">
          <Select>
            {CHOICES_CARD.map(key => {
              return (
                <Select.Option key={key} value={key}>
                  {FIELD_DICTIONARY[key]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Описание" labelAlign="left">
          <TextArea />
        </Form.Item>
        <Form.List name="choices">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} direction="vertical" style={{ width: '100%' }}>
                  <Typography.Text>
                    Вариант №{index + 1} <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Typography.Text>
                  <div className={s.choice}>
                    <Form.Item
                      {...field}
                      fieldKey={[field.name, 'description']}
                      name={[field.name, 'description']}
                      label="Описание варианта"
                    >
                      <TextArea />
                    </Form.Item>
                    <div className={s.resources}>
                      <Form.Item
                        {...field}
                        fieldKey={[field.name, 'resources', 'white']}
                        name={[field.name, 'resources', 'white']}
                        label="СК (Б)"
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        fieldKey={[field.name, 'resources', 'dark']}
                        name={[field.name, 'resources', 'dark']}
                        label="СК (Ч)"
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        fieldKey={[field.name, 'resources', 'lives']}
                        name={[field.name, 'resources', 'lives']}
                        label="Жизни"
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        fieldKey={[field.name, 'resources', 'money']}
                        name={[field.name, 'resources', 'money']}
                        label="Деньги"
                      >
                        <InputNumber />
                      </Form.Item>
                    </div>
                  </div>
                </Space>
              ))}

              <Button onClick={() => add()} type="dashed" block>
                Добавить вариант ответа
              </Button>
            </>
          )}
        </Form.List>
      </Card>
    </Form>
  );
};

export default AddCard;
