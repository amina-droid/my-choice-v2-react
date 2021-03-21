/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCards
// ====================================================

export interface GetCards_cards {
  __typename: "ChoiceCard" | "Incident";
  description: string;
  typeName: string;
  _id: any;
}

export interface GetCards {
  cards: GetCards_cards[];
}
