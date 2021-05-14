/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMessages
// ====================================================

export interface GetMessages_messages_author {
  __typename: "Author";
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
}
