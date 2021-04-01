import React, { FC, useContext } from 'react';
import { Button, Modal, Typography } from 'antd';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';

import {
  OnDroppedCard,
  OnDroppedCardVariables,
  ON_DROPPED_CARD,
  Choice,
  CHOICE,
  ChoiceVariables, SendOpportunityResult, SEND_OPPORTUNITY_RESULT, ActivePlayer, ACTIVE_PLAYER,
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
    const apolloClient = useApolloClient();
    const player = apolloClient.readFragment<ActivePlayer>({
      id: `Player:${user?._id}`,
      fragment: ACTIVE_PLAYER,
    });
    const [choiceReq] = useMutation<Choice, ChoiceVariables>(CHOICE);
    const [opportunityReq] = useMutation<
      SendOpportunityResult,
      SendOpportunityResult
      >(SEND_OPPORTUNITY_RESULT);
    const { data, error } = useSubscription<
      OnDroppedCard, OnDroppedCardVariables
      >(ON_DROPPED_CARD, {
      variables: {
        gameId,
      },
      fetchPolicy: 'network-only',
    });

    console.log(player);

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
            {data?.cardDropped.card.__typename === 'Incident' && (
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
