import React, { FC, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Avatar, Spin } from 'antd';
import { GET_USER, GetUser, GetUserVariables } from '../../apollo';

import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import usePrevious from '../../utils/usePrevious';
import { UserRole } from '../../types';

import StatisticPage from './Statistic';
import s from './Statistic.module.sass';

type Props = RouteComponentProps<{
  userId: string
}>

const UserStatistic: FC<Props> = ({ match }) => {
  const [getUser, { data, loading, error }] = useLazyQuery<GetUser, GetUserVariables>(GET_USER);
  const previousUser = usePrevious(match.params.userId);
  useEffect(() => {
    if (!loading && match.params.userId && match.params.userId !== previousUser) {
      getUser({
        variables: {
          userId: match.params.userId,
        },
      });
    }
  }, [getUser, match.params.userId, loading]);

  const userTitle = useMemo(() => {
    if (!data?.user) return undefined;
    return (
      <div className={s.userTitle}>
        <Avatar className={s.userTitleAvatar} src={data?.user?.photos[0].url} size={50} />
        {data?.user?.nickname}
      </div>
    );
  }, [data]);

  if (loading) {
    return (
      <div className={s.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className={s.container}>
        Такого пользователя не существует
      </div>
    );
  }

  return <StatisticPage title={userTitle} userId={data?.user?._id} />;
};

export default withAccess<Props>([UserRole.User], true)(UserStatistic);
