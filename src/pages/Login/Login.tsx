import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { Button, Card } from 'antd';
import {
  AUTH_VK,
  AuthVK,
  AuthVKVariables,
  GET_VK_OATH_REDIRECT_URL,
  GetVKOAuthRedirect,
} from '../../apollo';
import { AuthContext } from '../../context/auth';

import s from './Login.module.sass';

const Login = () => {
  const history = useHistory();
  const [authLoading, setAuthLoading] = useState(false);
  const { token, login } = useContext(AuthContext);
  const [authVK] = useMutation<AuthVK, AuthVKVariables>(AUTH_VK);
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (token && history.location.pathname === '/') {
      history.push('/main');
    }
  }, [token, history.location.pathname]);

  const vkSignHandler = (e: any) => {
    const loginWindow = window.open('', 'OAuth')!;
    e.preventDefault();
    setAuthLoading(true);
    (async () => {
      async function authHandler(this: Window, event: MessageEvent) {
        // 'this' = children window
        if (/^react-devtools/gi.test(event?.data?.source)) {
          return;
        }

        const code = event.data?.payload?.code;
        if (code) {
          // eslint-disable-next-line react/no-this-in-sfc
          this.close();
          window.removeEventListener('message', authHandler);

          try {
            const { data, errors } = await authVK({ variables: { code } });

            if (errors || !data) return;

            const { token: responseToken } = data.authVK;
            console.log(responseToken);
            login(responseToken);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            throw error;
          } finally {
            setAuthLoading(false);
          }
        }
      }

      try {
        const { data } = await apolloClient.query<GetVKOAuthRedirect>({
          query: GET_VK_OATH_REDIRECT_URL,
        });

        const { url } = data.getVKOAuthRedirect;

        loginWindow.location.href = url;
        window.addEventListener('message', authHandler.bind(loginWindow));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw error;
      }
    })();
  };

  return (
    <>
      <div className={s.contain}>
        <Card title='Игра "Мой выбор"' className={s.card}>
          <Button loading={authLoading} onClick={vkSignHandler} type="primary">
            Войти в игру
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Login;
