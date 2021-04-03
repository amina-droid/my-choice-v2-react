import React, { useCallback, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useLazyQuery } from '@apollo/client';
import { GET_USER, GetUser, GetUserVariables } from '../../apollo';

interface State {
  token: string | null;
  user?: GetUser['user'] | null;
  userLoad?: boolean;
  login: Login;
  logout: () => void;
}

export interface Login {
  (token: string): void;
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

const INITIAL_TOKEN = localStorage.getItem('token');
export const AuthContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(INITIAL_TOKEN);

  const [getUser, { data, loading }] = useLazyQuery<GetUser, GetUserVariables>(GET_USER);

  useEffect(() => {
    if (token && !data?.user) {
      const { _id } = jwtDecode(token) as any;
      getUser({ variables: { userId: _id } });
    }
  }, [token, data, getUser]);

  const login: Login = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    window.location.reload();
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        token,
        user: data?.user,
        userLoad: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
