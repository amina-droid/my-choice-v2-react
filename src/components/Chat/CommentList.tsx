import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CustomScroll from 'react-custom-scroll';

import Tooltip from 'antd/es/tooltip';
import Popconfirm from 'antd/es/popconfirm';
import Avatar from 'antd/es/avatar';
import Comment from 'antd/es/comment';
import List from 'antd/es/list';
import Button from 'antd/es/button';
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined';

import 'react-custom-scroll/dist/customScroll.css';

import { GetMessages } from 'api/apollo';
import { withAccess } from 'shared/AccessHOC/AccessHOC';
import { UserRole } from 'types';

import s from './Chat.module.sass';

const Z_INDEX = { zIndex: 1200 };

type Props = {
  comments: GetMessages['messages'];
  onRemove: (id: string) => void;
  onLoad?: () => void;
  visible?: boolean;
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
  onLoad,
  visible,
}) => {
  return (
    <CustomScroll allowOuterScroll keepAtBottom>
      {visible && !loading && (
        <Button type="link" block onClick={onLoad} loading={loading}>Загрузить еще</Button>)}
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
