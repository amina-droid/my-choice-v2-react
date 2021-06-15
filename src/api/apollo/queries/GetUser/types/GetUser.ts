/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserRole } from "./../../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_name {
  __typename: "UserName";
  familyName: string;
  givenName: string;
}

export interface GetUser_user_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GetUser_user {
  __typename: "User";
  _id: any;
  role: UserRole;
  name: GetUser_user_name;
  nickname: string;
  photos: GetUser_user_photos[];
}

export interface GetUser {
  user: GetUser_user | null;
}

export interface GetUserVariables {
  userId: any;
}
