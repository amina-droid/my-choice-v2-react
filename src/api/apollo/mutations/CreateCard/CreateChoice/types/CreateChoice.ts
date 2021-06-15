/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateChoicesCardInput, FieldType } from "types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChoice
// ====================================================

export interface CreateChoice_createChoicesCard_Incident {
  __typename: "Incident" | "Opportunity";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
}

export interface CreateChoice_createChoicesCard_ChoiceCard_choices_resources {
  __typename: "Resources";
  dark: number | null;
  white: number | null;
  lives: number | null;
  money: number | null;
}

export interface CreateChoice_createChoicesCard_ChoiceCard_choices {
  __typename: "Option";
  description: string;
  resources: CreateChoice_createChoicesCard_ChoiceCard_choices_resources;
}

export interface CreateChoice_createChoicesCard_ChoiceCard {
  __typename: "ChoiceCard";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
  choices: CreateChoice_createChoicesCard_ChoiceCard_choices[];
}

export type CreateChoice_createChoicesCard = CreateChoice_createChoicesCard_Incident | CreateChoice_createChoicesCard_ChoiceCard;

export interface CreateChoice {
  createChoicesCard: CreateChoice_createChoicesCard;
}

export interface CreateChoiceVariables {
  input: CreateChoicesCardInput;
}
