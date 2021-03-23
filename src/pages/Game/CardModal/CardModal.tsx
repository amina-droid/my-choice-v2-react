import React, { FC, useContext } from 'react';
import { useSubscription } from '@apollo/client';

import {
  OnDroppedCard,
  OnDroppedCardVariables,
  ON_DROPPED_CARD,
} from '../../../apollo';
import { AuthContext } from '../../../context/auth';

type CardModalProps = {
  gameId: string
}
const CardModal: FC<CardModalProps> = ({ gameId }) => {
  const { user } = useContext(AuthContext);
  useSubscription<OnDroppedCard, OnDroppedCardVariables>(ON_DROPPED_CARD, {
    variables: {
      gameId,
    },
    fetchPolicy: 'network-only',
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data?.cardDropped) return;
      const { cardDropped: card } = subscriptionData.data;
    },
  });

  return <div />;
};

export default CardModal;
