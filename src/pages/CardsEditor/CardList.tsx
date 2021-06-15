import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import CustomScroll from 'react-custom-scroll';
import { Button, Modal, message, Popconfirm, Card, List } from 'antd';
import Text from 'antd/es/typography/Text';
import { EditOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { DELETE_CARD, DeleteCard, DeleteCardVariables } from 'api/apollo/mutations';
import { GET_CARDS, GetCards } from 'api/apollo/queries';

import EditCard from './EditCard';

import s from './CardsEditor.module.sass';

type TCard = GetCards['cards'][0];

const CardList = () => {
  const [editableCard, setEditableCard] = useState<TCard | undefined>();
  const { data, loading } = useQuery<GetCards>(GET_CARDS);
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

  const remove = async (id: string) => {
    try {
      await deleteCard({ variables: { id } });
      message.success('Карточка удалена');
    } catch (e) {
      message.error('Произошла ошибка, попробуйте снова');
      console.error(e);
    }
  };

  const editCard = (card: TCard) => {
    setEditableCard(card);
  };

  const closeModal = () => {
    setEditableCard(undefined);
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
                    <Text
                      copyable={{
                        text: card._id,
                        tooltips: ['Скопировать ID', 'Скопировано!'],
                      }}
                    >
                      ID: {card._id}
                    </Text>
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
                            onClick={() => editCard(card)}
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
      <Modal
        visible={Boolean(editableCard)}
        onCancel={closeModal}
        destroyOnClose
        width={1000}
        title={`Редактирование карточки № ${editableCard?._id}`}
        footer={null}
      >
        <EditCard
          card={editableCard}
          onComplete={closeModal}
        />
      </Modal>
    </>
  );
};

export default CardList;
