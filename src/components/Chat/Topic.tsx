import React, { useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Comment } from 'antd';

import { useChatContext } from '../../context/chat';
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
  const { incrementMessage } = useChatContext();
  const variables = useMemo(() => ({ topic }), [topic]);
  const [sendMessage, { loading }] = useMutation<SendMessage, SendMessageVariables>(SEND_MESSAGE);
  const [getMessages, { data, loading: initLoading, subscribeToMore }] = useLazyQuery<
    GetMessages,
    GetMessagesVariables
  >(GET_MESSAGES, {
    variables,
    nextFetchPolicy: 'cache-only',
  });

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (!subscribeToMore) return () => {};
    const unsubscribe = subscribeToMore<OnMessage, OnMessageVariables>({
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        if (!subscriptionData?.data?.onMessage) return previousQueryResult;

        const newMessage = subscriptionData.data.onMessage;
        incrementMessage();
        return {
          messages: [newMessage, ...(previousQueryResult.messages || [])],
        };
      },
      document: ON_MESSAGE,
      variables,
    });

    return () => unsubscribe();
  }, [subscribeToMore, variables, incrementMessage]);

  const handleSubmit = useCallback(
    async (message: string) => {
      if (!message) return;

      await sendMessage({
        variables: {
          message,
          topic,
        },
      });
    },
    [sendMessage, topic],
  );
  return (
    <div className={s.chatContainer}>
      <CommentList loading={initLoading} comments={data?.messages.slice().reverse() || []} />
      <Comment content={<Editor onSubmit={handleSubmit} submitting={loading} />} />
    </div>
  );
};

export default Topic;
