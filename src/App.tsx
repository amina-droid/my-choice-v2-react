import React, { useMemo } from 'react';
import { Menu, Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons/lib';
import { BrowserRouter, Link, Route, Switch, useHistory } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import 'antd/dist/antd.css';

import { client } from './apollo';
import { AuthContextProvider, useAuth } from './context/auth';
import { ChatContextProvider } from './context/chat';
import Login from './pages/Login/Login';
import Lobby from './pages/Lobby/Lobby';
import Statistic from './pages/Statistic/Statistic';
import Game from './pages/Game/Game';
import NotFound from './pages/NotFound/NotFound';
import AddCard from './pages/CardsEditor/CardsEditor';
import ProtectedRoute from './utils/ProtectedRoute';
import { UserRole } from './types';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';

import s from './App.module.sass';

const PagesWithNavigation = () => {
  const { user } = useAuth();
  const history = useHistory();
  const initialKey = useMemo(() => history.location.pathname, [history.location.pathname]);

  const handleClick = (e: any) => {
    history.push(e.key);
  };

  return (
    <>
      <Layout.Header className={s.Header}>
        <Menu
          onClick={handleClick}
          mode="horizontal"
          className={s.Nav}
          defaultSelectedKeys={[initialKey]}
          overflowedIndicator={<div className={s.NavCollapsed}><MenuOutlined /></div>}
        >
          <Menu.Item key="/lobby" className={s.NavItem}>
            <Link to="/lobby">
              Играть
            </Link>
          </Menu.Item>
          <Menu.Item key="/statistic" className={s.NavItem} disabled>
            <Link to="/statistic">
              Статистика
            </Link>
          </Menu.Item>
          {(user?.role === UserRole.Admin || user?.role === UserRole.Moderator) && (
            <Menu.Item className={s.NavItem} key="/add-card">
              <Link to="/add-card">
                Добавить карточки
              </Link>
            </Menu.Item>
          )}
        </Menu>
        <Profile />
      </Layout.Header>
      <Switch>
        <ProtectedRoute exact path="/lobby" component={Lobby} />
        <ProtectedRoute exact path="/statistic" component={Statistic} />
        <ProtectedRoute exact path="/add-card" component={AddCard} />
      </Switch>
    </>
  );
};

const ActivePages = () => {
  return (
    <ChatContextProvider>
      <Chat />
      <Switch>
        <ProtectedRoute exact path="/game/:gameId" component={Game} />
        <PagesWithNavigation />
      </Switch>
    </ChatContextProvider>
  );
};
const backender = 'https://vk.com/deivoff';
const frontender = 'https://vk.com/ami_mazurova';

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <BrowserRouter>
          <div className={s.App}>
            <Switch>
              <Route exact path="/" component={Login} />
              <ActivePages />
              <Route component={NotFound} exact />
            </Switch>
          </div>
          <Layout.Footer className={s.Footer}>
            Backend - <a style={{ color: 'black' }} href={backender} target="_blank" rel="noreferrer">Евгений Мазуров</a>. Frontend - <a style={{ color: 'black' }} href={frontender} target="_blank" rel="noreferrer">Амина Мазурова</a>. Мой выбор ©2020
          </Layout.Footer>
        </BrowserRouter>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
