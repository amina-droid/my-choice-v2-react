import React, { useContext, useState } from 'react';
import { Button, Tabs } from 'antd';
import { CloseOutlined, CommentOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/auth';

import s from './Chat.module.sass';
import Topic from './Topic';

const { TabPane } = Tabs;

type Props = {};

export const Chat: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  if (!user) return null;
  return (
    <>
      <Button hidden={isOpen} className={s.openBtn} onClick={() => setIsOpen(true)}>
        <CommentOutlined />
      </Button>
      <div className={s.tabsContainer} hidden={!isOpen}>
        <Tabs defaultActiveKey="1" type="card" className={s.tabs}>
          <TabPane tab="Общий" key="1">
            <Topic topic="Общий" />
          </TabPane>
        </Tabs>
        <Button icon={<CloseOutlined />} className={s.closeBtn} onClick={() => setIsOpen(false)} />
      </div>
    </>
  );
};

export default Chat;
