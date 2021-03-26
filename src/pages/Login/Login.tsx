import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { Button, Card } from 'antd';
import {
  AUTH_VK,
  AuthVK,
  AuthVKVariables,
  GET_VK_OATH_REDIRECT_URL,
  GetVKOAuthRedirect,
} from '../../apollo';
import { AuthContext } from '../../context/auth';
import useOAuthSignIn from './useOAuthSignIn';

import s from './Login.module.sass';

const Login = () => {
  const history = useHistory();
  const { token, login } = useContext(AuthContext);
  const apolloClient = useApolloClient();

  const [handlerLogin, loading] = useOAuthSignIn({
    onCode: async (code) => {
      const { data, errors } = await apolloClient.mutate<AuthVK, AuthVKVariables>({
        mutation: AUTH_VK,
        variables: { code },
      });

      if (errors) throw errors;
      if (!data) return;

      const { token: responseToken } = data.authVK;
      login(responseToken);
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
      history.push('/main');
    }
  }, [token, history.location.pathname]);

  return (
    <>
      <div className={s.contain}>
        <Card title='Игра "Мой выбор"' className={s.card}>
          <Button loading={loading} onClick={handlerLogin} type="primary">
            Войти в игру
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Login;
