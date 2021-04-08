import React, { useCallback, useMemo, useState } from 'react';
import { Menu, Layout } from 'antd';
import { without } from 'lodash';
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
import CardsEditor from './pages/CardsEditor/CardsEditor';
import ProtectedRoute from './utils/ProtectedRoute';
import { UserRole } from './types';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';
import Rules, { RulesContextProvider } from './components/Rules/Rules';
import logo from './img/logo.png';

import s from './App.module.sass';

const PagesWithNavigation = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([history.location.pathname]);
  const [visibleRules, setVisibleRules] = useState<boolean>(false);

  const handleClick = (e: any) => {
    if (e.key === '/rules') {
      setSelectedKeys(prevState => ([
        ...prevState,
        e.key,
      ]));
      setVisibleRules(true);
      return;
    }
    setSelectedKeys([e.key]);
    history.push(e.key);
  };

  const closeRulesModal = useCallback(() => {
    setSelectedKeys(prevState => without(prevState, '/rules'));
    setVisibleRules(false);
  }, []);

  return (
    <>
      <Layout.Header className={s.Header}>
        <button type="button" className={s.Logo}>
          <img src={logo} alt="Мой выбор 3.0" className={s.LogoImg} />
          Мой выбор 3.0
        </button>
        <Menu
          onClick={handleClick}
          mode="horizontal"
          className={s.Nav}
          selectedKeys={selectedKeys}
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
          <Menu.Item key="/rules" className={s.NavItem}>
            Правила
          </Menu.Item>
          {(user?.role === UserRole.Admin || user?.role === UserRole.Moderator) && (
            <Menu.Item className={s.NavItem} key="/edit-cards">
              <Link to="/edit-cards">
                Редактировать карточки
              </Link>
            </Menu.Item>
          )}
        </Menu>
        <Profile />
      </Layout.Header>
      <Rules visible={visibleRules} closeModal={closeRulesModal} />
      <Switch>
        <ProtectedRoute exact path="/lobby" component={Lobby} />
        <ProtectedRoute exact path="/statistic" component={Statistic} />
        <ProtectedRoute exact path="/edit-cards" component={CardsEditor} />
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
        <RulesContextProvider>
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
        </RulesContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
