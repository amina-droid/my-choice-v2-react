/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AuthVK
// ====================================================

export interface AuthVK_authVK {
  __typename: "Tokens";
  access: string;
  refresh: string;
}

export interface AuthVK {
  authVK: AuthVK_authVK;
}

export interface AuthVKVariables {
  code: string;
  extra?: string | null;
}
