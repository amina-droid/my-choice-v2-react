import React, { FC } from 'react';
import { Button, Modal, Typography } from 'antd';
import { useMutation, useSubscription } from '@apollo/client';

import {
  OnDroppedCard,
  OnDroppedCardVariables,
  ON_DROPPED_CARD,
  Choice,
  CHOICE,
  ChoiceVariables,
  SendOpportunityResult,
  SEND_OPPORTUNITY_RESULT,
  SendOpportunityResultVariables,
} from '../../../apollo';
import Dice from '../Dice/Dice';

import s from './CardModal.module.sass';

type CardModalProps = {
  gameId: string;
  visible: boolean;
  closeModal: () => void;
};
const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, visible, closeModal }) => {
    const [choiceReq] = useMutation<Choice, ChoiceVariables>(CHOICE);
    const [opportunityReq] = useMutation<
      SendOpportunityResult,
      SendOpportunityResultVariables
      >(SEND_OPPORTUNITY_RESULT);
    const { data, error } = useSubscription<
      OnDroppedCard, OnDroppedCardVariables
      >(ON_DROPPED_CARD, {
      variables: {
        gameId,
      },
      fetchPolicy: 'no-cache',
    });

    const onOpportunityClick = () => {
      opportunityReq();
      closeModal();
    };

    const onOpportunityDiceClick = (diceCount?: number) => {
      opportunityReq({
        variables: {
          diceCount,
        },
      });
    };

    const onIncidentOrChoicesClick = (cardId: string, choiceId?: string) => {
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
          <Typography.Text
            className={s.choiceDescription}
          >
            {data?.cardDropped.card.description}
          </Typography.Text>
          <div className={s.choiceContainer}>
            {data?.cardDropped.card.__typename === 'ChoiceCard' &&
              data.cardDropped.card.choices.map(choice => (
                <Button
                  type="default"
                  key={choice._id}
                  className={s.choiceButton}
                  onClick={() => onIncidentOrChoicesClick(data?.cardDropped.card._id, choice._id)}
                  block
                >
                  {choice.description}
                </Button>
              ))}
            {data?.cardDropped.card.__typename === 'Incident' && (
              <Button
                type="primary"
                key={data?.cardDropped.card._id}
                onClick={() => onIncidentOrChoicesClick(data?.cardDropped.card._id)}
                block
              >
                Ок
              </Button>
            )}
            {data?.cardDropped.card.__typename === 'Opportunity'
            && (data.cardDropped.card.canTryLuck
              ? (
              <Dice ready onRoll={onOpportunityDiceClick} onRollComplete={closeModal} />
            ) : (
                <Button
                  type="primary"
                  key={data?.cardDropped.card._id}
                  onClick={onOpportunityClick}
                  block
                >
                  Ок
                </Button>
              ))}
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
