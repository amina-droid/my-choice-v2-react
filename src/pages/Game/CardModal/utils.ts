import { OnDroppedCard } from 'api/apollo/subscriptions';

export type ModalBodyProps<T = 'ChoiceCard' | 'Incident' | 'Opportunity'> = {
  card: Extract<OnDroppedCard['cardDropped']['card'], { __typename: T }>;
  onAction: (cardId: string) => void;
  choiceId?: string;
  isCurrentPlayer: boolean;
}

export function getCardImgUrl(path?: string) {
  if (!path) return undefined;
  return `https://xn--72-9kcd8arods1i.xn--p1ai/assets/cards/${path}.svg`;
}
