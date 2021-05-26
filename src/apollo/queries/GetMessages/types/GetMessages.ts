/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMessages
// ====================================================

export interface GetMessages_messages_author {
  __typename: "Author";
  _id: any;
  nickname: string;
  avatar: string | null;
}

export interface GetMessages_messages {
  __typename: "Message";
  _id: any;
  author: GetMessages_messages_author;
  createdAt: any;
  message: string;
}

export interface GetMessages {
  messages: GetMessages_messages[];
}

export interface GetMessagesVariables {
  topic: string;
  limit?: number | null;
  offset?: number | null;
}
