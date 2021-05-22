import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Comment, List, Popconfirm, Tooltip } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons/lib';
import moment from 'moment';
import CustomScroll from 'react-custom-scroll';
import 'react-custom-scroll/dist/customScroll.css';
import { GetMessages } from '../../apollo';
import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import { UserRole } from '../../types';

import s from './Chat.module.sass';

const Z_INDEX = { zIndex: 1200 };

type Props = {
  comments: GetMessages['messages'];
  onRemove: (id: string) => void;
  loading?: boolean;
};

type RemoveProps = {
  onOk: () => void;
}

const RemoveComment = withAccess<RemoveProps>([UserRole.Moderator])(({ onOk }) => {
  return (
    <Popconfirm
      overlayStyle={Z_INDEX}
      title="Вы уверены что хотите удалить это сообщение?"
      onConfirm={onOk}
      okText="Да"
      cancelText="Нет"
      destroyTooltipOnHide
    >
      <MinusCircleOutlined className={s.removeBtn} />
    </Popconfirm>
  );
});

const CommentList: React.FC<Props> = ({
  comments,
  loading,
  onRemove,
}) => {
  return (
    <CustomScroll allowOuterScroll keepAtBottom>
      <List
        dataSource={comments}
        itemLayout="horizontal"
        loading={loading}
        className={s.commentsList}
        renderItem={({ author, message, createdAt, _id }) => {
          const date = moment(createdAt);
          return (
            <Comment
              avatar={<Avatar src={author.avatar} />}
              author={<Link to={`/statistic/${author._id}`}>{author.nickname}</Link>}
              datetime={
                <>
                  <Tooltip title={date.format('DD.MM.YY HH:mm:ss')} overlayStyle={Z_INDEX}>
                    <span>{date.format('HH:mm')}</span>
                  </Tooltip>
                  <RemoveComment onOk={() => onRemove(_id)} key={_id} />,
                </>
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
