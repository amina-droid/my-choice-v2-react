import React, { useState } from 'react';
import { Button, Card, List, message, Modal, Popconfirm, Typography } from 'antd';
import { EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import CustomScroll from 'react-custom-scroll';
import {
  GET_CARDS, GetCards,
  DELETE_CARD, DeleteCard, DeleteCardVariables,
} from '../../apollo';

import s from './CardsEditor.module.sass';
import EditCard from './EditCard';

const CardList = () => {
  const [editableCardId, setEditableCardId] = useState<string | undefined>();
  const { data, loading, error } = useQuery<GetCards>(GET_CARDS);
  const [deleteCard] = useMutation<DeleteCard, DeleteCardVariables>(DELETE_CARD, {
    update: (cache, { data: removeCardData }) => {
      if (!removeCardData?.removeCard) return;
      const { _id, __typename } = removeCardData.removeCard;
      const removedRef = `${__typename}:${_id}`;
      cache.modify({
        fields: {
          cards(existingCards = []) {
            return existingCards.filter((card: any) => card.__ref !== removedRef);
          },
        },
      });
    },
  });

  console.log(data, error);
  const remove = async (id: string) => {
    try {
      await deleteCard({ variables: { id } });
      message.success('Карточка удалена');
    } catch (e) {
      message.error('Произошла ошибка, попробуйте снова');
      console.error(e);
    }
  };

  const editCard = (id: string) => {
    setEditableCardId(id);
  };

  return (
    <>
      <Card className={s.cards} title={`Созданные карточки (${data?.cards.length || 0})`}>
        <CustomScroll allowOuterScroll keepAtBottom>
          <List
            loading={loading}
            className={s.cardsList}
            size="large"
            dataSource={data?.cards}
            renderItem={card => (
              <List.Item>
                <List.Item.Meta
                  description={
                    <Typography.Text
                      copyable={{
                        text: card._id,
                        tooltips: ['Скопировать ID', 'Скопировано!'],
                      }}
                    >
                      ID: {card._id}
                    </Typography.Text>
                  }
                  title={
                    <>
                      {card.typeName}
                      {card.__typename === 'ChoiceCard' && (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            className={s.editBtn}
                            type="text"
                            shape="circle"
                            onClick={() => editCard(card._id)}
                          />

                          <Popconfirm
                            placement="right"
                            title="Вы уверены что хотите удалить эту карточку?"
                            onConfirm={() => remove(card._id)}
                            okText="Да"
                            cancelText="Нет"
                          >
                            <MinusCircleOutlined className={s.removeBtn} />
                          </Popconfirm>
                        </>
                      )}
                    </>
                  }
                />
                {card.description}
              </List.Item>
            )}
          />
        </CustomScroll>
      </Card>
      <Modal visible={Boolean(editableCardId)}>
        <EditCard card={data?.cards.find(card => card._id === editableCardId)} />
      </Modal>
    </>
  );
};

export default CardList;
