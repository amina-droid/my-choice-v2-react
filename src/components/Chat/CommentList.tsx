import React from 'react';
import { Avatar, Comment, List, Tooltip } from 'antd';
import moment from 'moment';
import CustomScroll from 'react-custom-scroll';
import 'react-custom-scroll/dist/customScroll.css';

import s from './Chat.module.sass';
import { GetMessages } from '../../apollo';

type Props = {
  comments: GetMessages['messages'];
  loading?: boolean;
};

const CommentList: React.FC<Props> = ({ comments, loading }) => {
  return (
    <CustomScroll allowOuterScroll keepAtBottom>
      <List
        dataSource={comments}
        itemLayout="horizontal"
        loading={loading}
        className={s.commentsList}
        renderItem={({ author, message, createdAt }) => {
          const date = moment(createdAt);
          return (
            <Comment
              avatar={<Avatar src={author.avatar} />}
              author={author.nickname}
              datetime={
                <Tooltip title={date.format('DD.MM.YY HH:mm:ss')}>
                  <span>{date.format('HH:mm')}</span>
                </Tooltip>
              }
              content={<p>{message}</p>}
            />
          );
        }}
      />
    </CustomScroll>
  );
};

export default CommentList;
