/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateChoicesCardInput, FieldType } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChoicesCard
// ====================================================

export interface UpdateChoicesCard_updateChoicesCard_Incident {
  __typename: "Incident" | "Opportunity";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
}

export interface UpdateChoicesCard_updateChoicesCard_ChoiceCard_choices_resources {
  __typename: "Resources";
  dark: number | null;
  white: number | null;
  lives: number | null;
  money: number | null;
}

export interface UpdateChoicesCard_updateChoicesCard_ChoiceCard_choices {
  __typename: "Option";
  description: string;
  resources: UpdateChoicesCard_updateChoicesCard_ChoiceCard_choices_resources;
}

export interface UpdateChoicesCard_updateChoicesCard_ChoiceCard {
  __typename: "ChoiceCard";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
  choices: UpdateChoicesCard_updateChoicesCard_ChoiceCard_choices[];
}

export type UpdateChoicesCard_updateChoicesCard = UpdateChoicesCard_updateChoicesCard_Incident | UpdateChoicesCard_updateChoicesCard_ChoiceCard;

export interface UpdateChoicesCard {
  updateChoicesCard: UpdateChoicesCard_updateChoicesCard;
}

export interface UpdateChoicesCardVariables {
  cardId: any;
  updateChoicesCard: UpdateChoicesCardInput;
}
