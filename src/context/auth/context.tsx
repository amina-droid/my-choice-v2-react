import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useLazyQuery } from '@apollo/client';
import { GET_USER, GetUser, GetUserVariables } from '../../apollo';

import useEventListener from '../../utils/useEventListener';
import { getTime } from '../../utils/getTime';
import Token, { Tokens } from '../../utils/token';

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

  const logout = useCallback(() => {
    Token.clear(true);
  }, []);

  const login = useCallback((tokens: Tokens) => {
    Token.set(tokens, true);
  }, []);

  useEventListener<Tokens | null>('token:update', (e) => {
    setToken(e.detail?.access || null);
  }, document);

  useEffect(() => {
    if (!loading && token && !data?.user) {
      const { _id, exp } = jwtDecode(token) as any;
      const isExpired = exp < getTime() / 1000;

      if (isExpired) {
        Token.refresh();
        return;
      }
      getUser({ variables: { userId: _id } });
    }
  }, [token, data, getUser, loading]);

  const contextValue = useMemo(() => ({
    logout,
    login,
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
