/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChatMessage
// ====================================================

export interface ChatMessage_author {
  __typename: "Author";
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
