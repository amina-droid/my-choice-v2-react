/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AuthVK
// ====================================================

export interface AuthVK_authVK {
  __typename: "AuthResponse";
  token: string;
}

export interface AuthVK {
  authVK: AuthVK_authVK;
}

export interface AuthVKVariables {
  code: string;
}
