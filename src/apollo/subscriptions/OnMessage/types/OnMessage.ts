/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessage
// ====================================================

export interface OnMessage_onMessage_author {
  __typename: "Author";
  nickname: string;
  avatar: string | null;
}

export interface OnMessage_onMessage {
  __typename: "Message";
  _id: any;
  author: OnMessage_onMessage_author;
  createdAt: any;
  message: string;
}

export interface OnMessage {
  onMessage: OnMessage_onMessage;
}

export interface OnMessageVariables {
  topic: string;
}
