/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChoicesCardInput } from "./../../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChoice
// ====================================================

export interface CreateChoice_createChoicesCard {
  __typename: "ChoiceCard" | "Incident";
  typeName: string;
  description: string;
  _id: any;
}

export interface CreateChoice {
  createChoicesCard: CreateChoice_createChoicesCard;
}

export interface CreateChoiceVariables {
  input: ChoicesCardInput;
}
