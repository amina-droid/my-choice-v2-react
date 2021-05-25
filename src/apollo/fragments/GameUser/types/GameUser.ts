/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GameUser
// ====================================================

export interface GameUser_photos {
  __typename: "UserPhoto";
  url: string;
}

export interface GameUser {
  __typename: "User";
  _id: any;
  nickname: string;
  photos: GameUser_photos[];
}
