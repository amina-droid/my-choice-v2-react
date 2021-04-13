import { OnDroppedCard } from '../../../apollo';

export type ModalBodyProps<T = 'ChoiceCard' | 'Incident' | 'Opportunity'> = {
  card: Extract<OnDroppedCard['cardDropped']['card'], { __typename: T }>;
  onAction: (cardId: string) => void;
  choiceId?: string;
  isCurrentPlayer: boolean;
}