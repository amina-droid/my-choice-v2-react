import React, { FC } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import 'antd/dist/antd.css';
import './App.css';
import { client } from './apollo';
import { useAuth, AuthContextProvider } from './context/auth';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import Lobby from './pages/Lobby/Lobby';
import Statistic from './pages/Statistic/Statistic';
import Game from './pages/Game/Game';
import NotFound from './pages/NotFound/NotFound';
import AddCard from './pages/CardsEditor/CardsEditor';

const ProtectedRoute: FC<RouteProps> = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

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
            <Switch>
              <Route exact path="/" component={Login} />
              <ProtectedRoute exact path="/main" component={Main} />

              <ProtectedRoute exact path="/lobby" component={Lobby} />
              <ProtectedRoute exact path="/statistic" component={Statistic} />
              <ProtectedRoute exact path="/game/:id" component={Game} />
              <ProtectedRoute exact path="/add-card" component={AddCard} />
              <Route component={NotFound} exact />
            </Switch>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
