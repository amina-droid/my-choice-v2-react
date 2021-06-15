import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_USER, GetUser, GetUserVariables } from 'api/apollo';

import useEventListener from 'utils/useEventListener';
import Token, { Tokens, UpdateEvent } from 'utils/token';

interface State {
  token: string | null;
  user?: GetUser['user'] | null;
  userLoad?: boolean;
  login: (tokens: Tokens) => void;
  logout: () => void;
}

const AuthContext = React.createContext<State>({
  token: null,
  user: null,

  login: () => {
    /* do nothing. */
  },
  logout: () => {
    /* do nothing. */
  },
});

export const useAuth = () => useContext(AuthContext);

const INITIAL_TOKEN = Token.getAccessToken();
export const AuthContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(INITIAL_TOKEN);
  const [getUser, { data, loading }] = useLazyQuery<GetUser, GetUserVariables>(GET_USER);

  useEventListener<UpdateEvent>('token:update', (e) => {
    setToken(e.detail?.access || null);
  }, Token);

  useEffect(() => {
    if (!loading && token && !data?.user) {
      getUser({ variables: { userId: Token.decodedData?._id } });
    }
  }, [token, data, getUser, loading]);

  const contextValue = useMemo(() => ({
    logout: Token.logout,
    login: Token.login,
    token,
    user: data?.user,
    userLoad: loading,
  }), [loading, token, data]);

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};
