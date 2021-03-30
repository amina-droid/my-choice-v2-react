/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FieldType } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL fragment: NewCard
// ====================================================

export interface NewCard_Incident {
  __typename: "Incident" | "Opportunity";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
}

export interface NewCard_ChoiceCard_choices_resources {
  __typename: "Resources";
  dark: number | null;
  white: number | null;
  lives: number | null;
  money: number | null;
}

export interface NewCard_ChoiceCard_choices {
  __typename: "Option";
  description: string;
  resources: NewCard_ChoiceCard_choices_resources;
}

export interface NewCard_ChoiceCard {
  __typename: "ChoiceCard";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
  choices: NewCard_ChoiceCard_choices[];
}

export type NewCard = NewCard_Incident | NewCard_ChoiceCard;
