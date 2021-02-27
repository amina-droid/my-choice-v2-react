import React, { useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Comment } from 'antd';

import CommentList from './CommentList';
import Editor from './Editor';
import {
  GET_MESSAGES,
  GetMessages,
  GetMessagesVariables,
  ON_MESSAGE,
  OnMessage,
  OnMessageVariables,
  SEND_MESSAGE,
  SendMessage,
  SendMessageVariables,
} from '../../apollo';

import s from './Chat.module.sass';

type Props = {
  topic: string;
};

export const Topic: React.FC<Props> = ({ topic }) => {
  const [sendMessage, { loading }] = useMutation<SendMessage, SendMessageVariables>(SEND_MESSAGE);
  const { data, loading: initLoading, subscribeToMore } = useQuery<
    GetMessages,
    GetMessagesVariables
  >(GET_MESSAGES, {
    fetchPolicy: 'network-only',
    variables: {
      topic,
    },
  });

  useEffect(() => {
    subscribeToMore<OnMessage, OnMessageVariables>({
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        if (!subscriptionData?.data?.onMessage) return previousQueryResult;

        const newMessage = subscriptionData.data.onMessage;

        return {
          messages: [...(previousQueryResult.messages || []), newMessage],
        };
      },
      document: ON_MESSAGE,
      variables: {
        topic,
      },
    });
  }, [subscribeToMore]);

  const handleSubmit = async (message: string) => {
    if (!message) return;

    await sendMessage({
      variables: {
        message,
        topic,
      },
    });
  };
  return (
    <div className={s.chatContainer}>
      <CommentList comments={data?.messages || []} />
      <Comment content={<Editor onSubmit={handleSubmit} submitting={loading} />} />
    </div>
  );
};

export default Topic;
