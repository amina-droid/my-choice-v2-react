/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FieldType } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GetCards
// ====================================================

export interface GetCards_cards_Incident {
  __typename: "Incident" | "Opportunity";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
}

export interface GetCards_cards_ChoiceCard_choices_resources {
  __typename: "Resources";
  dark: number | null;
  white: number | null;
  lives: number | null;
  money: number | null;
}

export interface GetCards_cards_ChoiceCard_choices {
  __typename: "Option";
  description: string;
  resources: GetCards_cards_ChoiceCard_choices_resources;
}

export interface GetCards_cards_ChoiceCard {
  __typename: "ChoiceCard";
  _id: any;
  type: FieldType;
  typeName: string;
  description: string;
  choices: GetCards_cards_ChoiceCard_choices[];
}

export type GetCards_cards = GetCards_cards_Incident | GetCards_cards_ChoiceCard;

export interface GetCards {
  cards: GetCards_cards[];
}
