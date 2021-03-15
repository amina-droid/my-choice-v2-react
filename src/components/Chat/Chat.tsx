import React, { useContext, useState } from 'react';
import { Button, Tabs } from 'antd';
import { AuthContext } from '../../context/auth';

import Topic from './Topic';
import CloseButton from '../../shared/CloseButton/CloseButton';

import { ReactComponent as OpenChatBtn } from './chat.svg';

import s from './Chat.module.sass';

const { TabPane } = Tabs;

type Props = {
  game?: {
    name: string;
    topic: string;
  };
};

export const Chat: React.FC<Props> = ({ game }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" hidden={isOpen} className={s.openBtn} onClick={() => setIsOpen(true)}>
        <OpenChatBtn />
      </button>
      <div className={s.tabsContainer} hidden={!isOpen}>
        <Tabs defaultActiveKey="1" type="card" className={s.tabs}>
          <TabPane tab="Общий" key="1">
            <Topic topic="Общий" />
          </TabPane>
          {game && (
            <TabPane tab={game.name} key={game.topic}>
              <Topic topic={game.topic} />
            </TabPane>
          )}
        </Tabs>
        <CloseButton onClose={onClose} className={s.closeBtn} />
      </div>
    </>
  );
};

export default Chat;
