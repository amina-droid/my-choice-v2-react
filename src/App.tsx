import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { Spin, Layout } from 'antd';

import 'antd/dist/antd.css';

import { Client } from 'api/apollo';
import { AuthContextProvider } from 'context/auth';

import s from './App.module.sass';

const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));
const Login = React.lazy(() => import('./pages/Login/Login'));
const AuthorizedApp = React.lazy(() => import('./AuthorizedApp'));

const backender = 'https://vk.com/deivoff';
const frontender = 'https://vk.com/ami_mazurova';
const currentYear = new Date().getFullYear();

function App() {
  return (
    <ApolloProvider client={Client}>
      <AuthContextProvider>
          <BrowserRouter>
            <div className={s.App}>
              <Suspense fallback={<Spin size="large" />}>
                <Switch>
                  <Route exact path="/" component={Login} />
                  <AuthorizedApp />
                  <Route component={NotFound} exact />
                </Switch>
              </Suspense>
            </div>
            <Layout.Footer className={s.Footer}>
              Backend -{' '}
              <a style={{ color: 'black' }} href={backender} target="_blank" rel="noreferrer">
                Евгений Мазуров
              </a>
              . Frontend -{' '}
              <a style={{ color: 'black' }} href={frontender} target="_blank" rel="noreferrer">
                Амина Мазурова
              </a>
              . Мой выбор ©2019 — {currentYear}
            </Layout.Footer>
          </BrowserRouter>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
