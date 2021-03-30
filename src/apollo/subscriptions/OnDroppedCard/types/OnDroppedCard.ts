/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnDroppedCard
// ====================================================

export interface OnDroppedCard_cardDropped_card_Incident {
  __typename: "Incident" | "Opportunity";
  _id: any;
  description: string;
  typeName: string;
}

export interface OnDroppedCard_cardDropped_card_ChoiceCard_choices {
  __typename: "Option";
  _id: any;
  description: string;
}

export interface OnDroppedCard_cardDropped_card_ChoiceCard {
  __typename: "ChoiceCard";
  _id: any;
  description: string;
  typeName: string;
  choices: OnDroppedCard_cardDropped_card_ChoiceCard_choices[];
}

export type OnDroppedCard_cardDropped_card = OnDroppedCard_cardDropped_card_Incident | OnDroppedCard_cardDropped_card_ChoiceCard;

export interface OnDroppedCard_cardDropped {
  __typename: "DroppedCard";
  forPlayer: any;
  card: OnDroppedCard_cardDropped_card;
}

export interface OnDroppedCard {
  cardDropped: OnDroppedCard_cardDropped;
}

export interface OnDroppedCardVariables {
  gameId: any;
}
