import React, { FC } from 'react';
import { useMutation } from '@apollo/client';

import Button from 'antd/es/button';

import {
  SEND_OPPORTUNITY_RESULT,
  SendOpportunityResult,
  SendOpportunityResultVariables,
} from '../../../apollo';
import Dice from '../Dice/Dice';

import { ModalBodyProps } from './utils';

const OpportunityBody: FC<ModalBodyProps<'Opportunity'>> = ({
  card,
  onAction,
  isCurrentPlayer,
}) => {
  const [opportunityReq] = useMutation<SendOpportunityResult, SendOpportunityResultVariables>(
    SEND_OPPORTUNITY_RESULT,
  );

  const onOpportunityClick = (opportunityId: string) => () => {
    opportunityReq({
      variables: {
        opportunityId,
      },
    });
    onAction(opportunityId);
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

  return (
    (card.canTryLuck ? (
      <Dice
        ready={isCurrentPlayer}
        onRoll={onOpportunityDiceClick(card._id)}
        onRollComplete={() => onAction(card._id)}
      />
    ) : (
      <Button
        type="primary"
        key={card._id}
        disabled={!isCurrentPlayer}
        onClick={onOpportunityClick(card._id)}
        block
      >
        Ок
      </Button>
    ))
  );
};

export default OpportunityBody;
