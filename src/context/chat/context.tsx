import React, { Reducer, useCallback, useContext, useMemo, useReducer } from 'react';
import { omit } from 'lodash';

import { Actions } from 'types';

type ChatTopic = {
  title: string;
  id: string;
}

type Chats = {
  [key: string]: ChatTopic
}

interface Context {
  chats?: Chats;
  messagesCounter?: number;
  incrementMessage: () => void;
  addTopic: (topic: ChatTopic) => void;
  removeTopic: (topicId: string) => void;
  isOpen?: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatContext = React.createContext<Context>({
  addTopic: () => {},
  removeTopic: () => {},
  openChat: () => {},
  closeChat: () => {},
  incrementMessage: () => {},
});

interface State {
  isOpen: boolean;
  newMessagesCounter: number;
  chats: Chats
}

type ChatActions = Actions<{
  open: never;
  close: never;
  newMessage: never;
  addChat: ChatTopic;
  removeChat: ChatTopic['id'];
}>
const MAIN_TOPIC = 'Общий';
const initialState: State = {
  isOpen: false,
  newMessagesCounter: 0,
  chats: {
    [MAIN_TOPIC]: {
      id: MAIN_TOPIC,
      title: MAIN_TOPIC,
    },
  },
};

const chatReducer: Reducer<State, ChatActions> = (state, action) => {
  switch (action.type) {
  case 'open': {
    return ({
      ...state,
      isOpen: true,
      newMessagesCounter: 0,
    });
  }
  case 'close': {
    return ({
      ...state,
      isOpen: false,
    });
  }
  case 'addChat': {
    return ({
      ...state,
      chats: {
        ...state.chats,
        [action.payload.id]: action.payload,
      },
    });
  }
  case 'removeChat': {
    return ({
      ...state,
      chats: omit(state.chats, action.payload),
    });
  }
  case 'newMessage': {
    return ({
      ...state,
      newMessagesCounter: state.isOpen ? 0 : state.newMessagesCounter + 1,
    });
  }
  default: {
    return state;
  }
  }
};

export const useChatContext = () => useContext(ChatContext);
export const ChatContextProvider: React.FC = ({ children }) => {
  const [{
    isOpen,
    chats,
    newMessagesCounter,
  }, dispatch] = useReducer(chatReducer, initialState);
  const openChat = useCallback(() => {
    dispatch({ type: 'open' });
  }, [dispatch]);

  const addTopic = useCallback((topic: ChatTopic) => {
    dispatch({ type: 'addChat', payload: topic });
  }, [dispatch]);

  const removeTopic = useCallback((topicId: string) => {
    dispatch({ type: 'removeChat', payload: topicId });
  }, [dispatch]);

  const closeChat = useCallback(() => {
    dispatch({ type: 'close' });
  }, [dispatch]);

  const incrementMessage = useCallback(() => {
    dispatch({ type: 'newMessage' });
  }, [dispatch]);

  const handlers: Context = useMemo(() => ({
    incrementMessage,
    addTopic,
    removeTopic,
    openChat,
    closeChat,
  }), []);

  const value: Context = useMemo(() => ({
    chats,
    isOpen,
    messagesCounter: newMessagesCounter,
    ...handlers,
  }
  ), [chats, isOpen, newMessagesCounter]);

  return (
    <ChatContext.Provider
      value={value}
    >
      {children}
    </ChatContext.Provider>
  );
};
