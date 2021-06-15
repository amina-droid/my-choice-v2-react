import React, { FC, useReducer } from 'react';
import { remove } from 'lodash';
import { ApolloError, useSubscription } from '@apollo/client';
import { Spin, Modal, Statistic } from 'antd';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';

import {
  OnDroppedCard,
  OnDroppedCardVariables,
  ON_DROPPED_CARD,
  OnOptionChoice,
  OnOptionChoiceVariables,
  ON_OPTION_CHOICE,
} from 'api/apollo/subscriptions';

import timeout from 'utils/timeout';
import useDeadline from 'utils/useDeadline';
import { useAuth } from 'context/auth';
import { Actions } from 'types';

import OpportunityBody from './OpportunityBody';
import ChoicesAndIncidentBody from './ChoicesAndIncidentBody';
import { ModalBodyProps } from './utils';

import s from './CardModal.module.sass';

type CardModalProps = {
  gameId: string;
  serverTimer?: string;
  onError?: (error: Error | ApolloError) => void;
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
};

const initialCardState: CardState = {
  droppedCards: [],
  selectedChoiceId: undefined,
  activeCard: undefined,
};

type ID = string;
type CardActions = Actions<{
  pushCard: DroppedCard;
  removeCard: ID;
  addChoiceId: ID;
}>;

const cardReducer = (prevState: CardState, action: CardActions): CardState => {
  switch (action.type) {
    case 'pushCard': {
      return {
        ...prevState,
        droppedCards: [...prevState.droppedCards, action.payload],
        activeCard: action.payload,
      };
    }
    case 'addChoiceId': {
      return {
        ...prevState,
        selectedChoiceId: action.payload,
      };
    }
    case 'removeCard': {
      return {
        ...prevState,
        droppedCards: remove(prevState.droppedCards, ({ card }) => card._id === action.payload),
        activeCard:
          prevState.activeCard?.card._id !== action.payload ? prevState.activeCard : undefined,
        selectedChoiceId: undefined,
      };
    }
    default: {
      return prevState;
    }
  }
};

const CardModal: FC<CardModalProps> = React.memo(
  ({ gameId, onError, serverTimer }) => {
    const { user } = useAuth();
    const [{ activeCard, selectedChoiceId }, dispatch] = useReducer(cardReducer, initialCardState);
    const deadline = useDeadline(serverTimer);
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
        const { cardId, choiceId } = subscriptionData.data?.playerChoice || {};
        dispatch({ type: 'addChoiceId', payload: choiceId });
        await timeout(500);
        dispatch({ type: 'removeCard', payload: cardId });
      },
      fetchPolicy: 'no-cache',
    });

    const isCurrentPlayer = activeCard?.forPlayer === user?._id;

    const titleCard = (
      <>
        <Title level={4}>{activeCard?.card.typeName}</Title>
        {serverTimer && (
          <Statistic.Countdown
            value={deadline}
            format="mm:ss"
            className={s.timer}
          />
        )}
      </>
    );

    return (
      <>
        <Modal
          visible={Boolean(activeCard)}
          title={titleCard}
          footer={false}
          closable={false}
          destroyOnClose
        >
          <img
            src={activeCard?.card.img!}
            className={s.choiceImg}
            alt={`Карточка № ${activeCard?.card._id}`}
            onError={event => {
              // eslint-disable-next-line
              (event.target as any).style.display = 'none';
            }}
          />
          <Text className={s.choiceDescription}>
            {activeCard?.card.description}
          </Text>
          <div className={s.choiceContainer}>
            <CardBody
              choiceId={selectedChoiceId}
              card={activeCard?.card}
              onAction={cardId => dispatch({ type: 'removeCard', payload: cardId })}
              isCurrentPlayer={isCurrentPlayer}
            />
          </div>
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.gameId === nextProps.gameId && prevProps.serverTimer === nextProps.serverTimer;
  },
);

export default CardModal;
