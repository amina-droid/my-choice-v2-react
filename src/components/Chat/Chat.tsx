import React from 'react';

import Tabs from 'antd/es/tabs';
import Badge from 'antd/es/badge';

import { useAuth } from 'context/auth';
import { useChatContext } from 'context/chat';
import CloseButton from 'shared/CloseButton/CloseButton';

import Topic from './Topic';
import { ReactComponent as OpenChatBtn } from './chat.svg';

import s from './Chat.module.sass';

const { TabPane } = Tabs;

type Props = {
  game?: {
    name: string;
    topic: string;
  };
};

export const Chat: React.FC<Props> = () => {
  const { chats = {}, isOpen, closeChat, openChat, messagesCounter } = useChatContext();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <button type="button" hidden={isOpen} className={s.openBtn} onClick={openChat}>
        <Badge count={messagesCounter} offset={[-25, 4]}>
          <OpenChatBtn />
        </Badge>
      </button>
      <div className={s.tabsContainer} hidden={!isOpen}>
        <Tabs defaultActiveKey="1" type="card" className={s.tabs}>
          {Object.values(chats).map((chat) => (
            <TabPane tab={chat.title} key={chat.id}>
              <Topic topic={chat.id} />
            </TabPane>
          ))}
        </Tabs>
        <CloseButton onClose={closeChat} className={s.closeBtn} />
      </div>
    </>
  );
};

export default Chat;
