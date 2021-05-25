/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnMessage
// ====================================================

export interface OnMessage_onMessage_Message_author {
  __typename: "Author";
  _id: any;
  nickname: string;
  avatar: string | null;
}

export interface OnMessage_onMessage_Message {
  __typename: "Message";
  _id: any;
  author: OnMessage_onMessage_Message_author;
  createdAt: any;
  message: string;
}

export interface OnMessage_onMessage_RemoveMessage {
  __typename: "RemoveMessage";
  _id: any;
}

export type OnMessage_onMessage = OnMessage_onMessage_Message | OnMessage_onMessage_RemoveMessage;

export interface OnMessage {
  onMessage: OnMessage_onMessage;
}

export interface OnMessageVariables {
  topic: string;
}
