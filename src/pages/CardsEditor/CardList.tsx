import React from 'react';
import { Card, List, message, Popconfirm } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import CustomScroll from 'react-custom-scroll';
import { GET_CARDS, GetCards } from '../../apollo/queries/GetCards';
import { DELETE_CARD, DeleteCard, DeleteCardVariables } from '../../apollo/mutations/DeleteCard';

import s from './CardsEditor.module.sass';

const CardList = () => {
  const { data, loading } = useQuery<GetCards>(GET_CARDS);
  const [deleteCard] = useMutation<DeleteCard, DeleteCardVariables>(DELETE_CARD, {
    update: (cache, { data: removeCardData }) => {
      if (!removeCardData?.removeCard) return;
      const { _id, __typename } = removeCardData.removeCard;
      const removedRef = `${__typename}:${_id}`;
      cache.modify({
        fields: {
          cards(existingCards = []) {
            console.log({ existingCards });
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
      console.log(e);
    }
  };

  return (
    <Card className={s.cards} title="Созданные карточки">
      <CustomScroll allowOuterScroll keepAtBottom>
        <List
          loading={loading}
          className={s.cardsList}
          size="large"
          dataSource={data?.cards}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <>
                    {item.typeName}{' '}
                    <Popconfirm
                      placement="right"
                      title="Вы уверены что хотите удалить эту карточку?"
                      onConfirm={() => remove(item._id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <MinusCircleOutlined className={s.removeBtn} />
                    </Popconfirm>
                  </>
                }
              />
              {item.description}
            </List.Item>
          )}
        />
      </CustomScroll>
    </Card>
  );
};

export default CardList;
