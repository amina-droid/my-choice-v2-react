import React, { FC } from 'react';
import cn from 'classnames';
import { useMutation } from '@apollo/client';

import Button from 'antd/es/button';

import { CHOICE, Choice, ChoiceVariables } from '../../../apollo';

import { ModalBodyProps } from './utils';

import s from './CardModal.module.sass';

const ChoicesAndIncidentBody: FC<ModalBodyProps<'Incident' | 'ChoiceCard'>> = ({
  card,
  onAction,
  isCurrentPlayer,
  choiceId: selectedChoiceId,
}) => {
  const [choiceReq, { loading }] = useMutation<Choice, ChoiceVariables>(CHOICE);

  const onIncidentOrChoicesClick = (cardId: string, choiceId?: string) => {
    choiceReq({ variables: { cardId, choiceId } });
    onAction(cardId);
  };

  if (card.__typename === 'Incident') {
    return (
      <Button
        type="primary"
        disabled={!isCurrentPlayer}
        key={card._id}
        onClick={() => onIncidentOrChoicesClick(card._id)}
        block
      >
        Ок
      </Button>
    );
  }

  return (
    <>
      {card.choices.map(choice => {
        const className = cn(
          s.choiceButton,
          choice._id === selectedChoiceId && s.choiceActive,
        );
        return (
          <Button
            type="default"
            key={choice._id}
            className={className}
            disabled={loading || !isCurrentPlayer}
            onClick={() => onIncidentOrChoicesClick(card._id, choice._id)}
            block
          >
            {choice.description}
          </Button>
        );
      })}
    </>
  );
};

export default ChoicesAndIncidentBody;
