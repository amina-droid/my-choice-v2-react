import React, { FC, useState } from 'react';
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
  canBeVisible: boolean;
  closeModal: () => void;
};
const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, canBeVisible, closeModal }) => {
    const [droppedCard, setDroppedCard] = useState<OnDroppedCard['cardDropped']>();
    const [choiceReq] = useMutation<Choice, ChoiceVariables>(CHOICE);
    const [opportunityReq] = useMutation<
      SendOpportunityResult,
      SendOpportunityResultVariables
      >(SEND_OPPORTUNITY_RESULT);
    const { error } = useSubscription<
      OnDroppedCard, OnDroppedCardVariables
      >(ON_DROPPED_CARD, {
        variables: {
          gameId,
        },
        onSubscriptionData: (data) => {
          setDroppedCard(data?.subscriptionData?.data?.cardDropped);
        },
        fetchPolicy: 'no-cache',
      });

    const onOpportunityClick = () => {
      opportunityReq();
      closeModal();
      setDroppedCard(undefined);
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
      setDroppedCard(undefined);
    };

    return (
      <>
        <Modal
          visible={droppedCard && canBeVisible}
          title={droppedCard?.card.typeName}
          footer={false}
          closable={false}
          destroyOnClose
        >
          <Typography.Text
            className={s.choiceDescription}
          >
            {droppedCard?.card.description}
          </Typography.Text>
          <div className={s.choiceContainer}>
            {droppedCard?.card.__typename === 'ChoiceCard' &&
              droppedCard?.card.choices.map(choice => (
                <Button
                  type="default"
                  key={choice._id}
                  className={s.choiceButton}
                  onClick={() => onIncidentOrChoicesClick(droppedCard?.card._id, choice._id)}
                  block
                >
                  {choice.description}
                </Button>
              ))}
            {droppedCard?.card.__typename === 'Incident' && (
              <Button
                type="primary"
                key={droppedCard?.card._id}
                onClick={() => onIncidentOrChoicesClick(droppedCard?.card._id)}
                block
              >
                Ок
              </Button>
            )}
            {droppedCard?.card.__typename === 'Opportunity'
            && (droppedCard?.card.canTryLuck
              ? (
                <Dice ready onRoll={onOpportunityDiceClick} onRollComplete={closeModal} />
              ) : (
                <Button
                  type="primary"
                  key={droppedCard?.card._id}
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
    return prevProps.gameId === nextProps.gameId
      && prevProps.canBeVisible === nextProps.canBeVisible;
  },
);

export default CardModal;
