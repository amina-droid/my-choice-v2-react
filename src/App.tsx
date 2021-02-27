import React, { FC, useContext } from 'react';
import { BrowserRouter, Route, Redirect, RouteProps } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import 'antd/dist/antd.css';
import './App.css';
import { client } from './apollo';
import { AuthContext, AuthContextProvider } from './context/auth';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import Lobby from './pages/Lobby/Lobby';
import Statistic from './pages/Statistic/Statistic';

const ProtectedRoute: FC<RouteProps> = ({ component: Component, ...rest }) => {
  const { token } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={
        // @ts-ignore
        props => (!token ? <Redirect to="/" /> : <Component {...props} />)
      }
    />
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Login} />
            <ProtectedRoute exact path="/main" component={Main} />
            <ProtectedRoute exact path="/lobby" component={Lobby} />
            <ProtectedRoute exact path="/statistic" component={Statistic} />
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
