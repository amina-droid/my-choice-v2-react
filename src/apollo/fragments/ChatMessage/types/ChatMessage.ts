/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChatMessage
// ====================================================

export interface ChatMessage_author {
  __typename: "Author";
  _id: any;
  nickname: string;
  avatar: string | null;
}

export interface ChatMessage {
  __typename: "Message";
  _id: any;
  author: ChatMessage_author;
  createdAt: any;
  message: string;
}
