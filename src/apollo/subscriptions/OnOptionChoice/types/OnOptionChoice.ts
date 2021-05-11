/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnOptionChoice
// ====================================================

export interface OnOptionChoice_playerChoice {
  __typename: "ChoiceOption";
  cardId: any;
  choiceId: any | null;
}

export interface OnOptionChoice {
  playerChoice: OnOptionChoice_playerChoice;
}

export interface OnOptionChoiceVariables {
  gameId: any;
}
