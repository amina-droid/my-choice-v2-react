import React, { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Comment } from 'antd';

import {
  REMOVE_MESSAGE,
  RemoveMessage,
  RemoveMessageVariables,
  SEND_MESSAGE, SendMessage,
  SendMessageVariables,
} from 'api/apollo/mutations';
import { GET_MESSAGES, GetMessages, GetMessagesVariables } from 'api/apollo/queries';
import { ON_MESSAGE, OnMessage, OnMessageVariables } from 'api/apollo/subscriptions';

import { useChatContext } from 'context/chat';

import CommentList from './CommentList';
import Editor from './Editor';

import s from './Chat.module.sass';

type Props = {
  topic: string;
};

type LoadMoreState = {
  limit: number;
  visibleLoadMore: boolean;
}

const OFFSET = 20;
const LOAD_LIMIT = 10;
const initialState = {
  limit: OFFSET,
  visibleLoadMore: true,
};

export const Topic: React.FC<Props> = ({ topic }) => {
  const [{ limit, visibleLoadMore }, setLimit] = useState<LoadMoreState>(initialState);
  const { incrementMessage } = useChatContext();
  const
    [
      fetchMessages,
      { data, loading: initLoading, subscribeToMore, fetchMore },
    ] = useLazyQuery<
      GetMessages,
      GetMessagesVariables
      >(GET_MESSAGES, {
      nextFetchPolicy: 'cache-only',
    });
  const [sendMessage, {
    loading: sendLoading,
  }] = useMutation<SendMessage, SendMessageVariables>(SEND_MESSAGE);
  const [removeMessage] = useMutation<RemoveMessage, RemoveMessageVariables>(REMOVE_MESSAGE);

  const removeMessageHandler = useCallback(async (messageId) => {
    await removeMessage({
      variables: {
        messageId,
      },
      update(cache) {
        setLimit(prevState => ({
          ...prevState,
          limit: prevState.limit - 1,
        }));
        cache.writeQuery<GetMessages, GetMessagesVariables>({
          query: GET_MESSAGES,
          variables: { topic },
          data: {
            messages: cache.readQuery<GetMessages, GetMessagesVariables>({
              query: GET_MESSAGES,
              variables: { topic },
            })!.messages.filter((m) => (m._id !== messageId)),
          },
        });
      },
    });
  }, [removeMessage, topic]);

  useEffect(() => {
    fetchMessages({
      variables: {
        topic,
        offset: 0,
        limit,
      },
    });
  }, [fetchMessages]);

  useEffect(() => {
    if (!subscribeToMore) return () => {};
    const unsubscribe = subscribeToMore<OnMessage, OnMessageVariables>({
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        if (!subscriptionData?.data?.onMessage) return previousQueryResult;

        if (subscriptionData.data.onMessage.__typename === 'RemoveMessage') {
          const removedMessageId = subscriptionData.data.onMessage._id;
          setLimit(prevState => ({
            ...prevState,
            limit: prevState.limit + 1,
          }));
          return {
            messages: previousQueryResult
              .messages.filter(message => message._id !== removedMessageId),
          };
        }

        const newMessage = subscriptionData.data.onMessage;
        incrementMessage();
        return {
          messages: [newMessage, ...(previousQueryResult.messages || [])],
        };
      },
      document: ON_MESSAGE,
      variables: {
        topic,
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore, topic, incrementMessage]);

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

  const loadMore = useCallback(() => {
    fetchMore?.({
      variables: {
        offset: data?.messages.length,
        limit: LOAD_LIMIT,
      },
    }).then(fetchMoreResult => {
      setLimit(prevState => ({
        limit: prevState.limit + fetchMoreResult.data.messages.length,
        visibleLoadMore: fetchMoreResult.data.messages.length === LOAD_LIMIT,
      }));
    });
  }, [data]);
  return (
    <div className={s.chatContainer}>
      <CommentList
        onLoad={loadMore}
        loading={initLoading}
        visible={visibleLoadMore}
        comments={data?.messages.slice().reverse() || []}
        onRemove={removeMessageHandler}
      />
      <Comment content={<Editor onSubmit={handleSubmit} submitting={sendLoading} />} />
    </div>
  );
};

export default Topic;
