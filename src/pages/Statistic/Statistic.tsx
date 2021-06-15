import React, { useEffect, useMemo, useState } from 'react';
import { useRouteMatch, Switch, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Tabs, Avatar } from 'antd';

import {
  GET_USER,
  GetUser,
  GetUserVariables } from 'api/apollo/queries';

import usePrevious from 'utils/usePrevious';

import s from './Statistic.module.sass';

const ProfileStatistic = React.lazy(() => import('./ProfileStatistic'));
const GamesStatistic = React.lazy(() => import('./GamesStatistic'));

const { TabPane } = Tabs;

type RouteMatchProps = {
  tabId?: string;
}

const StatisticPage = () => {
  const { url, params } = useRouteMatch<RouteMatchProps>();
  const [customUser, setCustomUser] = useState<string>();
  const history = useHistory();
  const [getUser, { data, loading }] = useLazyQuery<GetUser, GetUserVariables>(GET_USER);
  const previousUser = usePrevious(customUser);

  useEffect(() => {
    if (!loading && customUser && customUser !== previousUser) {
      getUser({
        variables: {
          userId: customUser,
        },
      });
    }
  }, [getUser, customUser, loading]);

  const userTitle = useMemo(() => {
    if (!data?.user) return undefined;
    return (
      <div className={s.userTitle}>
        <Avatar className={s.userTitleAvatar} src={data?.user?.photos[0].url} size={50} />
        {data?.user?.nickname}
      </div>
    );
  }, [data]);

  useEffect(() => {
    if (params.tabId && params.tabId !== 'own') {
      setCustomUser(params.tabId);
    }
  }, [params.tabId]);

  return (
    <div className={s.container}>
      <Switch>
        <Tabs
          activeKey={url}
          size="large"
          className={s.tab}
          onChange={history.push}
        >
          <TabPane tab={<span className={s.navItem}>Моя статистика</span>} key="/statistic">
            <ProfileStatistic />
          </TabPane>
          {customUser && (
            <TabPane
              tab={
                <span
                  className={s.navItem}
                >
                {(loading || !data?.user) ? 'Загрузка...' : data.user.nickname}
                </span>
              }
              closable
              key={`/statistic/${customUser}`}
            >
              <ProfileStatistic title={userTitle} userId={customUser} />
            </TabPane>
          )}
          <TabPane tab={<span className={s.navItem}>Общая статистика</span>} key="/statistic/own">
            <GamesStatistic />
          </TabPane>
        </Tabs>
      </Switch>
    </div>
  );
};

export default StatisticPage;
