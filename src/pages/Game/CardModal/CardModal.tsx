import React, { FC, useContext } from 'react';
import { Button, Modal, Typography } from 'antd';
import { useMutation, useSubscription } from '@apollo/client';

import {
  OnDroppedCard,
  OnDroppedCardVariables,
  ON_DROPPED_CARD,
  Choice,
  CHOICE,
  ChoiceVariables,
} from '../../../apollo';
import { AuthContext } from '../../../context/auth';

import s from './CardModal.module.sass';

type CardModalProps = {
  gameId: string;
  visible: boolean;
  closeModal: () => void;
};
const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, visible, closeModal }) => {
    const { user } = useContext(AuthContext);
    const [choiceReq] = useMutation<Choice, ChoiceVariables>(CHOICE);
    const { data, error } = useSubscription<
      OnDroppedCard, OnDroppedCardVariables
      >(ON_DROPPED_CARD, {
      variables: {
        gameId,
      },
      fetchPolicy: 'network-only',
    });

    console.log(error);

    const onClick = (cardId: string, choiceId?: string) => {
      choiceReq({ variables: { cardId, choiceId } });
      closeModal();
    };

    return (
      <>
        <Modal
          visible={visible}
          title={data?.cardDropped.card.typeName}
          footer={false}
          closable={false}
          destroyOnClose
        >
          <Typography.Text>{data?.cardDropped.card.description}</Typography.Text>
          <div className={s.choiceContainer}>
            {data?.cardDropped.card.__typename === 'ChoiceCard' &&
              data.cardDropped.card.choices.map(choice => (
                <Button
                  type="default"
                  key={choice._id}
                  onClick={() => onClick(data?.cardDropped.card._id, choice._id)}
                  block
                >
                  {choice.description}
                </Button>
              ))}
            {data?.cardDropped.card.__typename !== 'ChoiceCard' && (
              <Button
                type="primary"
                key={data?.cardDropped.card._id}
                onClick={() => onClick(data?.cardDropped.card._id)}
                block
              >
                Ок
              </Button>
            )}
          </div>
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.gameId === nextProps.gameId && prevProps.visible === nextProps.visible;
  },
);

export default CardModal;
