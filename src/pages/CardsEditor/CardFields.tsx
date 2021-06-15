import React from 'react';
import { Button, InputNumber, Select, Space, Form } from 'antd';
import Text from 'antd/es/typography/Text';
import TextArea from 'antd/es/input/TextArea';
import { MinusCircleOutlined } from '@ant-design/icons';

import { FieldType } from 'types';

import { FIELD_DICTIONARY } from './CardsEditor';

import s from './CardsEditor.module.sass';

const CHOICES_CARD = [FieldType.Dream, FieldType.Situation, FieldType.Reaction, FieldType.Offer];

export const normalizeChoices = (choices: any[] | null = []) => {
  return (choices || []).map(({ description, resources: { white, dark, money, lives } }) => {
    return {
      description,
      resources: {
        white: white === 0 ? null : white,
        dark: dark === 0 ? null : dark,
        lives: lives === 0 ? null : lives,
        money: money === 0 ? null : money,
      },
    };
  });
};

const CardFields = () => {
  return (
    <>
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
                <Text>
                  Вариант №{index + 1} <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Text>
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
    </>
  );
};

export default CardFields;
