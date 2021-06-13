/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RefreshTokens
// ====================================================

export interface RefreshTokens_refreshTokens {
  __typename: "Tokens";
  access: string;
  refresh: string;
}

export interface RefreshTokens {
  refreshTokens: RefreshTokens_refreshTokens;
}

export interface RefreshTokensVariables {
  access: string;
  refresh: string;
}
