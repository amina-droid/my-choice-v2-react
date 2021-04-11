import React, { FC, useEffect, useReducer, useState } from 'react';
import { remove, takeRight } from 'lodash';
import { Button, Modal, Spin, Typography } from 'antd';
import { ApolloError, useMutation, useSubscription } from '@apollo/client';

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
import timeout from '../../../utils/timeout';
import { useAuth } from '../../../context/auth';
import OpportunityBody from './OpportunityBody';
import ChoicesAndIncidentBody from './ChoicesAndIncidentBody';
import { Actions } from '../../../types';

import { ModalBodyProps } from './utils';

import s from './CardModal.module.sass';

type CardModalProps = {
  gameId: string;
  canBeVisible: boolean;
  closeModal: () => void;
  onError?: (error: Error | ApolloError) => void
};
type DroppedCard = OnDroppedCard['cardDropped'];

function CardBody<C extends DroppedCard['card'] = DroppedCard['card']>(
  props: Partial<ModalBodyProps>,
) {
  if (!props.card) {
    return <Spin />;
  }
  switch (props.card.__typename) {
    case 'Opportunity': {
      return OpportunityBody(props as any);
    }
    default: {
      return ChoicesAndIncidentBody(props as any);
    }
  }
}

type CardState = {
  droppedCards: DroppedCard[];
  selectedChoiceId?: string;
  activeCard?: DroppedCard;
}

const initialCardState: CardState = {
  droppedCards: [],
  selectedChoiceId: undefined,
  activeCard: undefined,
};

type CardActions = Actions<{
  pushCard: DroppedCard;
  removeCardFromServer: {
    cardId: string;
    currentUserId?: string;
  };
  addChoiceId: string;
  removeCardFromClient: never;
}>

const cardReducer = (prevState: CardState, action: CardActions): CardState => {
  console.log(action.type, prevState);
  switch (action.type) {
    case 'pushCard': {
      return {
        ...prevState,
        droppedCards: [...prevState.droppedCards, action.payload],
        activeCard: action.payload,
      };
    }
    case 'removeCardFromClient': {
      return {
        ...prevState,
        activeCard: undefined,
      };
    }
    case 'addChoiceId': {
      return {
        ...prevState,
        selectedChoiceId: action.payload,
      };
    }
    case 'removeCardFromServer': {
      return {
        ...prevState,
        droppedCards: remove(
          prevState.droppedCards,
          ({ card }) => card._id === action.payload.cardId,
        ),
        activeCard: prevState.activeCard?.forPlayer === action.payload.currentUserId
          ? prevState.activeCard
          : undefined,
        selectedChoiceId: undefined,
      };
    }
    default: {
      return prevState;
    }
  }
};

const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, canBeVisible, closeModal, onError }) => {
    const { user } = useAuth();
    const [{
      droppedCards,
      activeCard,
      selectedChoiceId,
    }, dispatch] = useReducer(cardReducer, initialCardState);
    useSubscription<OnDroppedCard, OnDroppedCardVariables>(ON_DROPPED_CARD, {
      variables: {
        gameId,
      },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.error) {
          onError?.(subscriptionData.error);
        }
        if (!subscriptionData?.data?.cardDropped) return;
        dispatch({ type: 'pushCard', payload: subscriptionData?.data?.cardDropped! });
      },
      fetchPolicy: 'no-cache',
    });
    useSubscription<OnOptionChoice, OnOptionChoiceVariables>(ON_OPTION_CHOICE, {
      variables: {
        gameId,
      },
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.error) {
          onError?.(subscriptionData.error);
        }
        const { cardId, choiceId } =
          subscriptionData.data?.playerChoice || {};
        dispatch({ type: 'addChoiceId', payload: choiceId });
        await timeout(500);
        dispatch({ type: 'removeCardFromServer', payload: { cardId, currentUserId: user?._id } });
      },
      fetchPolicy: 'no-cache',
    });
    const isCurrentPlayer = activeCard?.forPlayer === user?._id;
    return (
      <>
        <Modal
          visible={activeCard && canBeVisible}
          title={activeCard?.card.typeName}
          footer={false}
          closable={false}
          destroyOnClose
        >
          <Typography.Text className={s.choiceDescription}>
            {activeCard?.card.description}
          </Typography.Text>
          <div className={s.choiceContainer}>
            <CardBody
              choiceId={selectedChoiceId}
              card={activeCard?.card}
              onAction={() => dispatch({ type: 'removeCardFromClient' })}
              isCurrentPlayer={isCurrentPlayer}
            />
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
