import React, { FC, useEffect, useState } from 'react';
import { remove, takeRight } from 'lodash';
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
  OnOptionChoice,
  OnOptionChoiceVariables,
  ON_OPTION_CHOICE,
} from '../../../apollo';
import Dice from '../Dice/Dice';
import timeout from '../../../utils/timeout';
import { useAuth } from '../../../context/auth';

import s from './CardModal.module.sass';

type CardModalProps = {
  gameId: string;
  canBeVisible: boolean;
  closeModal: () => void;
};
type DroppedCard = OnDroppedCard['cardDropped'];
const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, canBeVisible, closeModal }) => {
    const { user } = useAuth();
    const [droppedCards, setDroppedCards] = useState<DroppedCard[]>([]);
    const [playerChoiceId, setPlayerChoiceId] = useState<string>();
    const [choiceReq, { loading }] = useMutation<Choice, ChoiceVariables>(CHOICE);
    const [droppedCard, setDroppedCard] = useState<DroppedCard>();
    const [opportunityReq] = useMutation<SendOpportunityResult, SendOpportunityResultVariables>(
      SEND_OPPORTUNITY_RESULT,
    );
    const { error } = useSubscription<OnDroppedCard, OnDroppedCardVariables>(ON_DROPPED_CARD, {
      variables: {
        gameId,
      },
      onSubscriptionData: data => {
        if (!data?.subscriptionData?.data?.cardDropped) return;
        setDroppedCards(prevState => [...prevState, data?.subscriptionData?.data?.cardDropped!]);
      },
      fetchPolicy: 'no-cache',
    });
    useSubscription<OnOptionChoice, OnOptionChoiceVariables>(ON_OPTION_CHOICE, {
      variables: {
        gameId,
      },
      onSubscriptionData: async data => {
        const { cardId, choiceId: selectedChoiceId } =
          data.subscriptionData.data?.playerChoice || {};
        setPlayerChoiceId(selectedChoiceId);
        await timeout(500);
        setPlayerChoiceId(undefined);
        console.log({ cardId, selectedChoiceId });
        setDroppedCards(prevState => remove(prevState, ({ card }) => card._id === cardId));
      },
      fetchPolicy: 'no-cache',
    });

    useEffect(() => {
      const newDroppedCard = takeRight(droppedCards)[0];
      setDroppedCard(newDroppedCard);
    }, [droppedCards.length]);

    const onOpportunityClick = (opportunityId: string) => () => {
      opportunityReq({
        variables: {
          opportunityId,
        },
      });
      setDroppedCard(undefined);
    };

    const onOpportunityDiceClick = (
      opportunityId: string,
    ) => (diceCount?: number) => {
      opportunityReq({
        variables: {
          diceCount,
          opportunityId,
        },
      });
    };

    const onIncidentOrChoicesClick = (cardId: string, choiceId?: string) => {
      choiceReq({ variables: { cardId, choiceId } });
      setDroppedCard(undefined);
    };

    console.log({
      droppedCard,
      droppedCards,
    });
    return (
      <>
        <Modal
          visible={droppedCard && canBeVisible}
          title={droppedCard?.card.typeName}
          footer={false}
          closable={false}
          destroyOnClose
        >
          <Typography.Text className={s.choiceDescription}>
            {droppedCard?.card.description}
          </Typography.Text>
          <div className={s.choiceContainer}>
            {droppedCard?.card.__typename === 'ChoiceCard' &&
              droppedCard?.card.choices.map(choice => (
                <Button
                  type="default"
                  key={choice._id}
                  className={s.choiceButton}
                  disabled={loading || droppedCard.forPlayer !== user?._id}
                  onClick={() => onIncidentOrChoicesClick(droppedCard?.card._id, choice._id)}
                  block
                >
                  {choice.description}
                </Button>
              ))}
            {droppedCard?.card.__typename === 'Incident' && (
              <Button
                type="primary"
                disabled={droppedCard.forPlayer !== user?._id}
                key={droppedCard?.card._id}
                onClick={() => onIncidentOrChoicesClick(droppedCard?.card._id)}
                block
              >
                Ок
              </Button>
            )}
            {droppedCard?.card.__typename === 'Opportunity' &&
              (droppedCard?.card.canTryLuck ? (
                <Dice
                  ready={droppedCard.forPlayer === user?._id}
                  onRoll={onOpportunityDiceClick(droppedCard?.card._id)}
                  onRollComplete={() => setDroppedCard(undefined)}
                />
              ) : (
                <Button
                  type="primary"
                  key={droppedCard?.card._id}
                  disabled={droppedCard.forPlayer !== user?._id}
                  onClick={onOpportunityClick(droppedCard?.card._id)}
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
    return (
      prevProps.gameId === nextProps.gameId && prevProps.canBeVisible === nextProps.canBeVisible
    );
  },
);

export default CardModal;
