import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import Tooltip from 'antd/es/tooltip';
import Button from 'antd/es/button';
import Card from 'antd/es/card';

import {
  AUTH_VK,
  AuthVK,
  AuthVKVariables,
  GET_VK_OATH_REDIRECT_URL,
  GetVKOAuthRedirect,
} from 'api/apollo';

import { useAuth } from 'context/auth';
import logo from 'assets/logo.svg';
import alliance from 'assets/alliance.png';
import tyumen from 'assets/tyumen.png';

import useOAuthSignIn from './useOAuthSignIn';

import s from './Login.module.sass';

const Login = () => {
  const history = useHistory();
  const { token, login } = useAuth();
  const apolloClient = useApolloClient();

  const [handlerLogin, loading] = useOAuthSignIn({
    onCode: async (code) => {
      const extra = new URLSearchParams(
        history.location.search,
      ).get('code');
      const { data, errors } = await apolloClient.mutate<AuthVK, AuthVKVariables>({
        mutation: AUTH_VK,
        variables: { code, extra },
      });

      if (errors) throw errors;
      if (!data) return;

      login(data.authVK);
    },
    redirectLink: async () => {
      const { data, error } = await apolloClient.query<GetVKOAuthRedirect>({
        query: GET_VK_OATH_REDIRECT_URL,
      });

      if (error) throw error;
      const { url } = data.getVKOAuthRedirect;
      return url;
    },
  });

  useEffect(() => {
    if (token && history.location.pathname === '/') {
      history.push('/lobby');
    }
  }, [token, history.location.pathname]);

  return (
    <>
      <div className={s.contain}>
        <Card
          cover={<img className={s.logo} alt="Логотип 'Мой выбор'" src={logo} />}
          className={s.card}
        >
          <Card.Meta
            title="Мой выбор 3.0"
            description="Первая социальная онлайн-игра"
            className={s.meta}
          />
          <Button
            loading={loading}
            onClick={handlerLogin}
            type="primary"
            block
          >
            Войти в игру
          </Button>
        </Card>
        <div className={s.partners}>
          <span className={s.partnersText}>Партнеры проекта</span>
          <Tooltip
            title="Альянс СО НКО Тюменской области"
          >
            <img className={s.partner} alt="Альянс СО НКО" src={alliance} />
          </Tooltip>
          <Tooltip
            title="Правительство Тюменской области"
          >
            <img className={s.partner} alt="Правительство Тюменской области" src={tyumen} />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Login;
